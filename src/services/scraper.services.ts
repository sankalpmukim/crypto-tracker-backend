import { CoinAssetType } from "@prisma/client";
import { getCurrentlySelectedCoins } from "../controllers/coins.controller";
import fetch from "node-fetch";
import queueClient from "./queue.services";
import { prisma } from "../initializers/prisma";

const ASSET_TARGET = "USD" as const;
// wait time for scraper polling
const WAIT_INTERVAL = 30 * 1000;

interface CoinAPIData {
  time: string;
  asset_id_base: CoinAssetType;
  asset_id_quote: typeof ASSET_TARGET;
  rate: number;
  error?: string;
}

interface CoinAPIError {
  error: string;
}

type CoinAPIResponse = CoinAPIData | CoinAPIError;

class CoinDataScraper {
  coins: CoinAssetType[] = [];
  coinsUpdated: boolean = false;
  coinsUpdating: boolean = false;
  intervalId: NodeJS.Timer | null = null;
  currentlyInScraping: boolean = false;
  constructor() {
    this.updateSelectedCoins();
  }
  async updateSelectedCoins() {
    if (this.coinsUpdating) return;
    this.coinsUpdating = false;
    const distinctSelectedCoins = await getCurrentlySelectedCoins();
    this.coins = distinctSelectedCoins.map((coin) => coin.coinAssetType);
    this.coinsUpdating = true;
    this.coinsUpdated = true;
  }
  async scrape() {
    try {
      if (!this.coinsUpdated) return;
      if (this.currentlyInScraping) {
        console.log("Already scraping");
        return;
      }
      // avoid multiple overlapping scrapes
      this.currentlyInScraping = true;

      // make request(s) to coinapi api
      // const data = await Promise.all(
      //   this.coins.map(async (coin) => {
      //     try {
      //       // get quote
      //       const coinData = await CoinDataScraper.getQuote(coin);
      //       if (typeof coinData?.error !== "undefined")
      //         throw new Error(coinData.error);
      //       // add to db
      //       await CoinDataScraper.addToDb(coinData);
      //       // push to queue
      //       // TODO: switch to batch publishing
      //       queueClient.publishMessage(JSON.stringify(coinData));
      //       return coinData;
      //     } catch (error) {
      //       console.log(error);
      //       throw error;
      //     }
      //   })
      // );
      const data = [];
      for (const coin of this.coins) {
        try {
          // get quote
          const coinData = await CoinDataScraper.getQuote(coin);
          if (typeof coinData?.error !== "undefined")
            throw new Error(coinData.error);
          // add to db
          await CoinDataScraper.addToDb(coinData);
          // push to queue
          // TODO: switch to batch publishing
          queueClient.publishMessage(JSON.stringify(coinData));
          data.push(coinData);
        } catch (error) {
          console.log(error);
          throw error;
        }
      }

      // reset scraping flag
      this.currentlyInScraping = false;

      console.log(data);
    } catch (err) {
      // reset scraping flag
      this.currentlyInScraping = false;
      console.log(err);
    }
  }
  startScraping() {
    this.intervalId = setInterval(() => {
      this.scrape();
    }, WAIT_INTERVAL);
  }
  stopScraping() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    } else {
      console.log("No interval to clear");
    }
  }

  static async getQuote(coin: CoinAssetType): Promise<CoinAPIData> {
    // make request to coinapi api
    const res = await fetch(
      process.env.COINAPI_URL + `/v1/exchangerate/${coin}/USD`,
      {
        headers: {
          "X-CoinAPI-Key": process.env.COINAPI_KEY ?? ``,
        },
      }
    );
    const data = (await res.json()) as CoinAPIData;

    return data;
  }

  static async addToDb(coinData: CoinAPIData) {
    console.log(`coinData`, JSON.stringify(coinData));
    // update db with new data
    return await prisma.coinQuotesLogs.create({
      data: {
        coinId: coinData.asset_id_base,
        price: coinData.rate,
      },
    });
  }
}

// singleton pattern
export const coinDataScraper = new CoinDataScraper();

export default CoinDataScraper;
