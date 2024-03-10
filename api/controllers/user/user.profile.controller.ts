import { Request, Response, NextFunction } from "express";
import usersServiceInstance from "../../services/users.service.js";
import customError from "../../utils/error.js";
import IUsersService from "../../interfaces/service.interfaces/users.service.interface.js";

class UserProfileController {
  private usersService: IUsersService;
  constructor(usersService: IUsersService) {
    this.usersService = usersService;
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.usersService.findById(req.session.user._id);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
  async addInterests(req: Request, res: Response, next: NextFunction) {
    try {
      const { interests } = req.body;
      console.log("interests::::", interests);
      const response = await this.usersService.addInterests(
        req.session.user?._id,
        interests
      );
      req.session.user = response.user;
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async sendChangeEmailVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;
      const response = await this.usersService.sendChangeEmailVerification(
        email
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async editProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, code, bio } = req.body;
      const response = await this.usersService.editProfile(
        req.session.user?._id,
        {
          name,
          email,
          code: Number(code),
          bio,
        }
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async changeProfileImage(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.usersService.changeProfileImage(
        req.session.user?._id,
        req.file.buffer
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new UserProfileController(usersServiceInstance);
