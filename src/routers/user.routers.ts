import { Request, Response, Router } from "express";
import {
  getAllUsers,
  getUserCoins,
  setUserCoins,
} from "../controllers/user.controller";

const userRouter = Router();

// GET all users (without passwords)
userRouter.get(`/`, async (req: Request, res: Response) => {
  const users = await getAllUsers();
  return res.status(200).json({ users });
});

// GET user coins
userRouter.get(`/coins`, async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  const userCoins = await getUserCoins(req.user.id);
  return res.status(200).json({ userCoins });
});

// SET user coins
userRouter.post(`/coins`, async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { coins } = req.body;
    if (!coins) return res.status(400).json({ error: "Missing coins" });
    const userCoins = await setUserCoins({ userId: req.user.id, coins });
    return res.status(200).json({ userCoins });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : `Something went wrong :(`,
    });
  }
});

export default userRouter;
