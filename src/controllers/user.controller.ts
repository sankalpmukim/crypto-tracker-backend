import { CoinAssetType, PreferenceType, SelectedCoin } from "@prisma/client";
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

interface SelectCoinForUsersInput {
  coin: CoinAssetType;
  preference: PreferenceType;
  price: number;
}

export const setUserCoins = async ({
  userId,
  coins,
}: {
  userId: string;
  coins: SelectCoinForUsersInput[];
}) => {
  // delete user's selectedCoins
  await prisma.selectedCoin.deleteMany({
    where: {
      userId,
    },
  });
  // create new selectedCoins
  const updated = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      selectedCoins: {
        createMany: {
          skipDuplicates: true,
          data: coins.map((coin) => ({
            userId,
            coinAssetType: coin.coin,
            preference: coin.preference,
            price: coin.price,
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
