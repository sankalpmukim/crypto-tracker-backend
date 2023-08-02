import { prisma } from "../initializers/prisma";
import { CoinAssetType, EmailPurpose } from "@prisma/client";

/**
 * Is fresh email required to be sent to user?
 */
export const isFreshEmailRequired = async ({
  email,
  purpose,
  coinAsset,
}: {
  email: string;
  purpose: EmailPurpose;
  coinAsset: CoinAssetType;
}) => {
  const lastEmail = await prisma.emailSent.findFirst({
    where: {
      email,
      purpose,
      coinAsset,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!lastEmail) {
    return true;
  }
  const lastEmailDate = new Date(lastEmail.createdAt);
  const currentDate = new Date();
  const diff = currentDate.getTime() - lastEmailDate.getTime();
  const diffInHours = diff / (1000 * 3600);
  if (diffInHours >= 24) {
    return true;
  }
  return false;
};

/**
 * email notif was sent to user for this purpose and this coin asset type
 */
export const setEmailSent = async ({
  email,
  purpose,
  coinAsset,
}: {
  email: string;
  purpose: EmailPurpose;
  coinAsset: CoinAssetType;
}) => {
  const emailSent = await prisma.emailSent.create({
    data: {
      email,
      purpose,
      coinAsset: coinAsset,
    },
  });
  return emailSent;
};
