import { Request, Response, NextFunction } from "express";
import progressServiceInstance, {
  ProgressService,
} from "../../services/progress.service.js";
import customError from "../../utils/error.js";

class UserProgressController {
  private progressService: ProgressService;
  constructor(progressService: ProgressService) {
    this.progressService = progressService;
  }

  async getAllProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.progressService.getAllProgress(
        req.session.user?._id
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async getCourseProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.progressService.getCourseProgress(
        req.session.user?._id,
        req.params.courseId
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async addVideoProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.progressService.addVideoProgress(
        req.session.user?._id,
        req.body.courseId,
        req.body.videoId
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async addExerciseProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.progressService.addExerciseProgress(
        req.session.user?._id,
        req.body.courseId,
        req.body.exerciseId
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new UserProgressController(progressServiceInstance);
