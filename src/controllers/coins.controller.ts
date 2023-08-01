import { prisma } from "../initializers/prisma";
import fs from "fs/promises";

export const getCoins = async () => {
  const coins = await prisma.coin.findMany();
  return coins;
};
