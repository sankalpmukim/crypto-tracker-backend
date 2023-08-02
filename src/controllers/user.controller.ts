import { CoinAssetType, SelectedCoin } from "@prisma/client";
import { prisma } from "../initializers/prisma";
import { coinDataScraper } from "../services/scraper.services";

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return users;
};

export const getUserCoins = async (
  userId: string
): Promise<(SelectedCoin & { lastPrice: number })[]> => {
  const userCoins = await prisma.selectedCoin.findMany({
    where: {
      userId,
    },
  });
  const finalData: (SelectedCoin & { lastPrice: number })[] = [];
  for (let i = 0; i < userCoins.length; i++) {
    const { coinAssetType } = userCoins[i];
    const data = await prisma.coinQuotesLogs.findFirst({
      where: {
        coinId: coinAssetType,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!data) continue;
    finalData.push({
      ...userCoins[i],
      lastPrice: data.price,
    });
  }
  return finalData;
};

interface SelectCoinForUsersInput {
  coin: CoinAssetType;
  lowPrice: number;
  highPrice: number;
}

export const setUserCoins = async ({
  userId,
  coins,
}: {
  userId: string;
  coins: SelectCoinForUsersInput[];
}) => {
  let updated = [];

  for (const coin of coins) {
    const { lowPrice, highPrice } = coin;

    // Check if the coin already exists for the user
    const existingCoin = await prisma.selectedCoin.findUnique({
      where: {
        userId_coinAssetType: {
          userId: userId,
          coinAssetType: coin.coin,
        },
      },
    });

    // If coin exists, update it. Else, create a new record.
    if (existingCoin) {
      const updatedCoin = await prisma.selectedCoin.update({
        where: {
          userId_coinAssetType: {
            userId: userId,
            coinAssetType: coin.coin,
          },
        },
        data: {
          lowPrice,
          highPrice,
        },
      });
      updated.push(updatedCoin);
    } else {
      const newCoin = await prisma.selectedCoin.create({
        data: {
          userId: userId,
          coinAssetType: coin.coin,
          lowPrice,
          highPrice,
        },
      });
      updated.push(newCoin);
    }
  }

  return updated;
};
