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
