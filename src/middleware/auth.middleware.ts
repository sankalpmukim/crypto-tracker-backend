import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/jwt.services";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // extract token from request
    const isToken = req.headers.authorization?.split(" ")[1];

    // if token is not present, return error
    if (!isToken) {
      return res.status(401).json({
        error: `Please login to continue`,
        success: false,
      });
    }

    // verify token
    const tokenPayload = verifyToken(isToken);

    // if token is invalid, return error
    if (typeof tokenPayload === "string") {
      return res.status(401).json({
        error: `Please login to continue`,
        success: false,
      });
    }

    // if token is valid, attach user to request object
    req.user = tokenPayload;

    // continue with the request
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      error:
        error instanceof Error
          ? error.message + `(auth)`
          : `Something went wrong (auth)`,
      success: false,
    });
  }
};
