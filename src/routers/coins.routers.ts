import { Request, Response, Router } from "express";
import { getCoins, getCoinUsers } from "../controllers/coins.controller";

const coinsRouter = Router();

// GET all coins
coinsRouter.get(`/`, async (req: Request, res: Response) => {
  const coins = await getCoins();
  return res.status(200).json({ coins });
});

// GET users for each type of coin
coinsRouter.get(`/users`, async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  const { coin } = req.query;
  if (!coin || typeof coin !== "string") {
    return res.status(400).json({ error: "Missing coin" });
  }
  const userCoins = await getCoinUsers(coin);
  return res.status(200).json({ userCoins });
});

export default coinsRouter;
