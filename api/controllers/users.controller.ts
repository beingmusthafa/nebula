import { Request, Response, NextFunction } from "express";
import UsersInterface from "../interfaces/users.interface.js";
import usersUseCaseInstance, {
  UsersUseCase,
} from "../use_cases/users.usecase.js";
import { customError } from "../utils/error.js";

class UsersController {
  private usersUseCase: UsersUseCase;
  constructor(usersUseCase: UsersUseCase) {
    this.usersUseCase = usersUseCase;
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      this.usersUseCase.create(req.body);
      res.status(201).send("User created");
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}
