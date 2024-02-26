import { Request, Response, NextFunction } from "express";
import enrollmentsServiceInstance, {
  EnrollmentsService,
} from "../../services/enrollments.service.js";
import customError from "../../utils/error.js";

class TutorStatsController {
  private enrollmentsService: EnrollmentsService;
  constructor(enrollmentsService: EnrollmentsService) {
    this.enrollmentsService = enrollmentsService;
  }

  async getGraphData(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.enrollmentsService.getGraphData(
        req.session.user._id
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  //   async getMonthlyStats(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const response = await this.enrollmentsService.getMonthlyStats(
  //         req.session.user._id
  //       );
  //       res.status(response.statusCode).json(response);
  //     } catch (error) {
  //       next(customError(500, error.message));
  //     }
  //   }

  async getTopCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.enrollmentsService.getTopCourses(
        req.session.user._id
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new TutorStatsController(enrollmentsServiceInstance);
