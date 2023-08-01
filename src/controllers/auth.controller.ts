import { User, Prisma } from "@prisma/client";
import { prisma } from "../initializers/prisma";
import bcrypt from "bcrypt";

export const createUser = async (
  user: Prisma.UserCreateInput
): Promise<Omit<User, "password">> => {
  // hash password
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;

  // create user
  const createdUser = await prisma.user.create({
    data: user,
  });

  // return user without password
  const { password, ...rest } = createdUser;
  return rest;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<Omit<User, "password">> => {
  // get user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // check if user exists
  if (!user) {
    throw new Error(`No user found for email: ${email}`);
  }

  // check if password is correct
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error(`Invalid password`);
  }

  // return user without password
  const { password: _, ...rest } = user;
  return rest;
};
