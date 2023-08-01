import jwt from "jsonwebtoken";

export const generateToken = (payload: any): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });

  return token;
};

export const verifyToken = (token: string): any => {
  const payload = jwt.verify(token, process.env.JWT_SECRET as string);
  return payload;
};
