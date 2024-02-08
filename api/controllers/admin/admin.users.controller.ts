import { Request, Response, NextFunction } from "express";
import UsersInterface from "../../interfaces/users.interface.js";
import customError from "../../utils/error.js";
import usersServiceInstance, {
  UsersService,
} from "../../services/users.service.js";

class AdminUsersController {
  private usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.usersService.findAll(
        req.user.email,
        Number(req.query.page) || 1
      );
      res.status(200).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("id", req.params.id);
      const response = await this.usersService.findById(req.params.id);
      if (!response) throw customError(404, "User not found");
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async changeBlockStatus(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body.blockStatus);
      const response = await this.usersService.changeBlockStatus(
        req.body.email,
        req.body.blockStatus
      );
      console.log(response);
      res.status(200).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new AdminUsersController(usersServiceInstance);
