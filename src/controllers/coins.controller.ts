import { CoinAssetType, Coin, SelectedCoin, Prisma } from "@prisma/client";
import { prisma } from "../initializers/prisma";
import { coinDataScraper } from "../services/scraper.services";

export const getCoins = async (): Promise<Coin[]> => {
  const coins = await prisma.coin.findMany();
  return coins;
};

export const getAllCurrentlySelectedCoins = async () => {
  const selectedCoins = await prisma.selectedCoin.findMany({
    select: {
      coinAssetType: true,
    },
    distinct: ["coinAssetType"],
  });
  return selectedCoins;
};

export const getCoinUsers = async (
  coin: string
): Promise<(SelectedCoin & { user: { email: string } })[]> => {
  const userCoins = await prisma.selectedCoin.findMany({
    where: {
      coinAssetType: coin as CoinAssetType,
    },
    select: {
      userId: true,
      coinAssetType: true,
      createdAt: true,
      user: {
        select: {
          email: true,
        },
      },
      lowPrice: true,
      highPrice: true,
    },
  });
  return userCoins;
};
