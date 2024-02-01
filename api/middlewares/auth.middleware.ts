import jwt from "jsonwebtoken";
import { customError } from "../utils/error.js";
import { Request, Response, NextFunction } from "express";
import usersRepositoryInstance, {
  UsersRepository,
} from "../repositories/users.repository.js";
import UsersInterface from "../interfaces/users.interface.js";
import CurrentUserInterface from "../interfaces/currentUser.interface.js";

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

  async userAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies["access_token"];
      if (!token) throw customError(401, "Unauthorized");
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      if (!id) throw customError(403, "Invalid token");
      if (!req.user) {
        req.user = await this.usersRepository.findById(id, {
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
      if (req.user.isBlocked)
        throw customError(403, "Your account is suspended");

      console.log("auth passed");
      next();
    } catch (error) {
      next(error);
    }
  }

  async adminAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies["access_token"];
      if (!token) throw customError(401, "Unauthorized");
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      if (!id) throw customError(401, "Invalid token");
      if (!req.user) {
        req.user = await this.usersRepository.findById(id, {
          name: 1,
          email: 1,
          image: 1,
          role: 1,
          isBlocked: 1,
          appointmentCost: 1,
          interests: 1,
        });
      }
      console.log("auth passed", req.user);
      if (req.user.role !== "admin" || req.user.isBlocked)
        throw customError(403, "Forbidden");
      next();
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthMiddleware(usersRepositoryInstance);
