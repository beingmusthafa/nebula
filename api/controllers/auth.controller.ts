import { Request, Response, NextFunction } from "express";
import UsersInterface from "../interfaces/users.interface.js";
import authServiceInstance, { AuthService } from "../services/auth.service.js";
import { customError } from "../utils/error.js";

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async startSignUp(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.authService.startSignUp(req.body);
      if (!response.success) {
        return next(customError(response.statusCode, response.message));
      }
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async finishSignUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { userDetails, code } = req.body;
      console.log({ code });
      const response = await this.authService.finishSignUp(
        userDetails,
        Number(code)
      );
      if (!response.success) {
        return next(customError(response.statusCode, response.message));
      }
      res
        .cookie("access_token", response.token, {
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
        })
        .json({ success: true, user: response.doc });
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.authService.signIn(req.body);
      if (!response.success) {
        return next(customError(response.statusCode, response.message));
      }
      res
        .cookie("access_token", response.token, {
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
        })
        .json({ success: true, user: response.doc });
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.authService.googleAuth(req.body);
      if (!response.success) {
        return next(customError(response.statusCode, response.message));
      }
      res
        .cookie("access_token", response.token, {
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
        })
        .json({ success: true, user: response.doc });
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async sendRecoveryCode(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.authService.sendRecoveryCode(req.body.email);
      if (!response.success) {
        return next(customError(response.statusCode, response.message));
      }
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async verifyCodeAndChangePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, code, password } = req.body;
      const response = await this.authService.verifyCodeAndChangePassword(
        email,
        code,
        password
      );
      if (!response.success) {
        return next(customError(response.statusCode, response.message));
      }
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new AuthController(authServiceInstance);
