import {
  CoinAssetType,
  Coin,
  SelectedCoin,
  Prisma,
  PreferenceType,
} from "@prisma/client";
import { prisma } from "../initializers/prisma";
import { coinDataScraper } from "../services/scraper.services";

export const getCoins = async (): Promise<Coin[]> => {
  const coins = await prisma.coin.findMany();
  return coins;
};

export const getCurrentlySelectedCoins = async () => {
  const selectedCoins = await prisma.selectedCoin.findMany({
    select: {
      coinAssetType: true,
    },
    distinct: ["coinAssetType"],
  });
  return selectedCoins;
};

export const selectCoin = async ({
  userId,
  coin,
  preference,
  price,
}: {
  userId: string;
  coin: string;
  preference: PreferenceType;
  price: number;
}): Promise<SelectedCoin> => {
  const newSelectedCoin = await prisma.selectedCoin.create({
    data: {
      userId,
      coinAssetType: coin as CoinAssetType,
      preference,
      price,
    },
  });

  await coinDataScraper.updateSelectedCoins();

  return newSelectedCoin;
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
      preference: true,
      price: true,
      createdAt: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });
  return userCoins;
};
