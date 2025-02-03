import jwt from "jsonwebtoken";
import { secret } from "../config";
import { NextFunction, Request, Response } from "express";

const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({
      message: "No token Provided",
    });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decodedData: any = await jwt.verify(token, secret);
    (req as any).user = decodedData.user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};

export default verifyToken;
