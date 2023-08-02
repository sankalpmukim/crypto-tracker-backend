import { Request, Response, Router } from "express";
import {
  isFreshEmailRequired,
  setEmailSent,
} from "../controllers/email.controller";
import { CoinAssetType, EmailPurpose } from "@prisma/client";

const emailRouter = Router();

function isEmailPurposeType(purpose: string): purpose is EmailPurpose {
  return Object.values(EmailPurpose).includes(purpose as EmailPurpose);
}

function isCoinAssetType(coinAsset: string): coinAsset is CoinAssetType {
  return Object.values(CoinAssetType).includes(coinAsset as CoinAssetType);
}

// GET is fresh email required
emailRouter.get(
  `/is-fresh-email-required`,
  async (req: Request, res: Response) => {
    const { email, purpose, coinAsset } = req.query;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Missing email" });
    }
    if (!purpose || typeof purpose !== "string") {
      return res.status(400).json({ error: "Missing purpose" });
    }
    if (isEmailPurposeType(purpose) === false) {
      return res.status(400).json({ error: "Invalid purpose" });
    }
    if (!coinAsset || typeof coinAsset !== "string") {
      return res.status(400).json({ error: "Missing coin asset" });
    }
    if (isCoinAssetType(coinAsset) === false) {
      return res.status(400).json({ error: "Invalid coin asset" });
    }

    const isFresh = await isFreshEmailRequired({
      email,
      purpose: purpose as EmailPurpose,
      coinAsset: coinAsset as CoinAssetType,
    });

    return res.status(200).json({ isFresh });
  }
);

// POST set email sent
emailRouter.post(`/set-email-sent`, async (req: Request, res: Response) => {
  const { email, purpose, coinAsset } = req.body;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Missing email" });
  }
  if (!purpose || typeof purpose !== "string") {
    return res.status(400).json({ error: "Missing purpose" });
  }
  if (!coinAsset || typeof coinAsset !== "string") {
    return res.status(400).json({ error: "Missing coin asset" });
  }
  const emailSent = await setEmailSent({
    email,
    purpose: purpose as EmailPurpose,
    coinAsset: coinAsset as CoinAssetType,
  });
  return res.status(200).json({ emailSent });
});

export default emailRouter;
