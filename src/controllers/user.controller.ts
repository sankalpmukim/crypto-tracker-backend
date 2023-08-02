import { CoinAssetType, SelectedCoin } from "@prisma/client";
import { prisma } from "../initializers/prisma";

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

export const getUserCoins = async (userId: string): Promise<SelectedCoin[]> => {
  const userCoins = await prisma.selectedCoin.findMany({
    where: {
      userId,
    },
  });
  return userCoins;
};

export const setUserCoins = async ({
  userId,
  coins,
}: {
  userId: string;
  coins: string[];
}) => {
  const updated = prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      selectedCoins: {
        deleteMany: {
          NOT: {
            coinAssetType: {
              in: coins as CoinAssetType[],
            },
          },
        },
        createMany: {
          data: coins.map((coin) => ({
            coinAssetType: coin as CoinAssetType,
          })),
        },
      },
    },
    include: {
      selectedCoins: true,
    },
  });
  return updated;
};
