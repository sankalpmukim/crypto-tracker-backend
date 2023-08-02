import {
  CoinAssetType,
  Coin,
  SelectedCoin,
  Prisma,
  PreferenceType,
} from "@prisma/client";
import { prisma } from "../initializers/prisma";

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

export const selectCoin = ({
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
  return prisma.selectedCoin.create({
    data: {
      userId,
      coinAssetType: coin as CoinAssetType,
      preference,
      price,
    },
  });
};

export const getUserCoins = async (
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
