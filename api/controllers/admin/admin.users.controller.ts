import { Request, Response, NextFunction } from "express";
import UsersInterface from "../../interfaces/users.interface.js";
import { customError } from "../../utils/error.js";
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
      next(error);
    }
  }
}

export default new AdminUsersController(usersServiceInstance);
