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
      if (!token) return next();
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      if (!id) return next();
      //TEST MODE/////////////////////////////////////////////////////////////////////////////
      // req.session.user = {
      //   _id: "65c38a47a80c66ffa1dd30ef",
      //   name: "Muhammad Musthafa",
      //   email: "musthafarebel48@gmail.com",
      //   image:
      //     "https://res.cloudinary.com/dfezowkdc/image/upload/v1706951267/gray-photo-placeholder-icon-design-ui-vector-35850819_vupnvf.jpg",
      //   role: "admin",
      //   isBlocked: false,
      //   appointmentCost: 0,
      //   interests: [
      //     "65c9891ee5db19cf23ee8791",
      //     "65c98936e5db19cf23ee8797",
      //     "65c989e8e5db19cf23ee87a0",
      //     "65c989a0e5db19cf23ee879d",
      //   ],
      //   education: [],
      //   experience: [],
      // };
      // TEST MODE/////////////////////////////////////////////////////////////////////////////
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
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const { id } = jwt.verify(token, process.env.JWT_SECRET);

        if (!id) {
          req.session.user = null;
          return next(customError(403, "Invalid token, login again"));
        }

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
          return next(customError(403, "Your account is suspended"));
        }
      }
      next();
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async adminAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const { id } = jwt.verify(token, process.env.JWT_SECRET);

        if (!id) {
          req.session.user = null;
          return next(customError(403, "Invalid token, login again"));
        }

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
        if (req.session.user.role !== "admin" || req.session.user.isBlocked) {
          req.session.user = null;
          return next(customError(403, "Forbidden"));
        }
      }
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default new AuthMiddleware(usersRepositoryInstance);
