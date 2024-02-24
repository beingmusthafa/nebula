import { Request, Response, NextFunction } from "express";
import usersServiceInstance, {
  UsersService,
} from "../../services/users.service.js";
import customError from "../../utils/error.js";

class UserProfileController {
  private usersService: UsersService;
  constructor(usersService: UsersService) {
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
}

export default new UserProfileController(usersServiceInstance);
