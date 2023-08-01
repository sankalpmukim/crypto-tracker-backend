import { Request, Response, Router } from "express";
import { createUser, loginUser } from "../controllers/auth.controller";
import { generateToken } from "../services/jwt.services";

const authRouter = Router();

authRouter.post("/signup", async (req: Request, res: Response<{}>) => {
  try {
    const { email, password, name } = req.body;

    // input validation
    if (
      !email ||
      !password ||
      !name ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof name !== "string"
    ) {
      return res.status(400).json({
        error: `Please provide all required fields`,
        success: false,
      });
    }

    const user = await createUser({ email, password, name });

    const token = generateToken(user);

    return res.json({ token, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : `Something went wrong`,
      success: false,
    });
  }
});

authRouter.post("/login", async (req: Request, res: Response<{}>) => {
  try {
    const { email, password } = req.body;

    // input validation
    if (
      !email ||
      !password ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        error: `Please provide all required fields`,
        success: false,
      });
    }

    // verify and fetch existing user by email id.
    const user = await loginUser(email, password);

    // generate token
    const token = generateToken(user);

    return res.json({ token, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : `Something went wrong`,
      success: false,
    });
  }
});

export default authRouter;
