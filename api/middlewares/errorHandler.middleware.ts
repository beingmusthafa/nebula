import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/error.js";

const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, message });
};

export default errorHandler;
