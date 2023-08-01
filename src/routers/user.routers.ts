import { Request, Response, Router } from "express";
import { getAllUsers } from "../controllers/user.controller";

const userRouter = Router();

// GET all users (without passwords)
userRouter.get(`/`, async (req: Request, res: Response) => {
  const users = await getAllUsers();
  return res.status(200).json({ users });
});

export default userRouter;
