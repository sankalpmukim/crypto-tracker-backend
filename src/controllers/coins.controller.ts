import { CoinAssetType, Coin, SelectedCoin, Prisma } from "@prisma/client";
import { prisma } from "../initializers/prisma";

export const getCoins = async (): Promise<Coin[]> => {
  const coins = await prisma.coin.findMany();
  return coins;
};

export const selectCoin = ({
  userId,
  coin,
}: {
  userId: string;
  coin: string;
}): Promise<SelectedCoin> => {
  return prisma.selectedCoin.create({
    data: {
      userId,
      coinAssetType: coin as CoinAssetType,
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
      user: {
        select: {
          email: true,
        },
      },
      createdAt: true,
    },
  });
  return userCoins;
};
