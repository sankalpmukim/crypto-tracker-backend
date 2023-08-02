import { Request, Response, Router } from "express";
import { getCoins, getUserCoins } from "../controllers/coins.controller";

const coinsRouter = Router();

// GET all coins
coinsRouter.get(`/`, async (req: Request, res: Response) => {
  const coins = await getCoins();
  return res.status(200).json({ coins });
});

// GET users for each type of coin
coinsRouter.get(`/users`, async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  const userCoins = await getUserCoins(req.user.id);
  return res.status(200).json({ userCoins });
});

export default coinsRouter;
