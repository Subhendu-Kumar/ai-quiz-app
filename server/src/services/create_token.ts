import jwt from "jsonwebtoken";
import { User } from "../types";
import { secret } from "../config";

export const createToken = (user: User) => {
  const token = jwt.sign({ user: user }, secret, {
    expiresIn: "1d",
  });
  return token;
};
