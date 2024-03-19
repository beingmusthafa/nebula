import { Request, Response, NextFunction } from "express";
import customError from "../../utils/error.js";
import usersServiceInstance from "../../services/users.service.js";
import IUsersService from "../../interfaces/service.interfaces/users.service.interface.js";

class AdminUsersController {
  private usersService: IUsersService;

  constructor(usersService: IUsersService) {
    this.usersService = usersService;
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.usersService.findAll(
        req.session.user.email,
        Number(req.query.page) || 1
      );
      res.status(200).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.usersService.findById(req.params.id);
      if (!response) throw customError(404, "User not found");
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async changeBlockStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.usersService.changeBlockStatus(
        req.body.email,
        req.body.blockStatus
      );
      res.status(200).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new AdminUsersController(usersServiceInstance);
