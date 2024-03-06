import jwt from "jsonwebtoken";
import customError from "../utils/error.js";
import { Request, Response, NextFunction } from "express";
import usersRepositoryInstance, {
  UsersRepository,
} from "../repositories/users.repository.js";
import UsersInterface from "../interfaces/users.interface.js";
import CurrentUserInterface from "../interfaces/currentUser.interface.js";
import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: CurrentUserInterface;
    }
  }
}

class AuthMiddleware {
  private usersRepository: UsersRepository;
  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async userIdentify(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token || token === "null") return next();
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      if (!id) return next();

      if (!req.session.user) {
        req.session.user = await this.usersRepository.findById(id, {
          _id: 1,
          name: 1,
          email: 1,
          image: 1,
          role: 1,
          isBlocked: 1,
          appointmentCost: 1,
          interests: 1,
        });
      }
      if (req.session.user.isBlocked) {
        req.session.user = null;
        throw customError(403, "Your account is suspended");
      }
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async userAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token || token === "null") throw customError(401, "Unauthorized");
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      if (!id) throw customError(403, "Invalid token, login again");

      if (!req.session.user) {
        req.session.user = await this.usersRepository.findById(id, {
          _id: 1,
          name: 1,
          email: 1,
          image: 1,
          role: 1,
          isBlocked: 1,
          appointmentCost: 1,
          interests: 1,
        });
      }
      if (req.session.user.isBlocked) {
        req.session.user = null;
        throw customError(403, "Your account is suspended");
      }
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async adminAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token || token === "null") throw customError(401, "Unauthorized");
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      if (!id) throw customError(403, "Invalid token, login again");

      if (!req.session.user) {
        req.session.user = await this.usersRepository.findById(id, {
          name: 1,
          email: 1,
          image: 1,
          role: 1,
          isBlocked: 1,
          appointmentCost: 1,
          interests: 1,
        });
      }
      if (req.session.user.role !== "admin" || req.session.user.isBlocked) {
        req.session.user = null;
        throw customError(403, "Forbidden");
      }
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default new AuthMiddleware(usersRepositoryInstance);
