import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/error.js";

const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(error);
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  res.status(statusCode).send({ success: false, message });
};

export default errorHandler;
