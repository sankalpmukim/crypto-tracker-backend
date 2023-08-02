import { CoinAssetType } from "@prisma/client";
import { getCurrentlySelectedCoins } from "../controllers/coins.controller";
import fetch from "node-fetch";
import queueClient from "./queue.services";

const ASSET_TARGET = "USD" as const;

interface CoinAPIData {
  time: string;
  asset_id_base: CoinAssetType;
  asset_id_quote: typeof ASSET_TARGET;
  rate: number;
}

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
      await Promise.all(
        this.coins.map(async (coin) => {
          try {
            // get quote
            const coinData = await CoinDataScraper.getQuote(coin);
            // add to db
            await CoinDataScraper.addToDb(coinData);
            // push to queue
            // TODO: switch to batch publishing
            queueClient.publishMessage(JSON.stringify(coinData));
          } catch (error) {
            console.log(error);
            throw error;
          }
        })
      );
    } catch (err) {
      console.log(err);
    }
  }
  startScraping() {
    this.intervalId = setInterval(() => {
      this.scrape();
    }, 1000 * 60 * 60 * 24);
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
    return fetch(process.env.COINAPI_URL + `/v1/exchangerate/${coin}/USD`, {
      headers: {
        "X-CoinAPI-Key": process.env.COINAPI_KEY ?? ``,
      },
    }).then((res) => res.json()) as Promise<CoinAPIData>;
  }

  static async addToDb(coinData: CoinAPIData) {
    // update db with new data
  }
}

// singleton pattern
export const coinDataScraper = new CoinDataScraper();

export default CoinDataScraper;
