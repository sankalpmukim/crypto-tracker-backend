import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

export const generateToken = (payload: any): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });

  return token;
};

export const verifyToken = (
  token: string
): string | (jwt.JwtPayload & Omit<User, "password">) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET as string) as
    | string
    | (jwt.JwtPayload & Omit<User, "password">);
  return payload;
};
