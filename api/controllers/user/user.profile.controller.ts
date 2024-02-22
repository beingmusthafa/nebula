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
      const user = await this.usersService.findById(req.session.user._id);
      res.json(user);
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
}

export default new UserProfileController(usersServiceInstance);
