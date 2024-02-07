import { Request, Response, NextFunction } from "express";
import customError from "../../utils/error.js";
import coursesServiceInstance, {
  CoursesService,
} from "../../services/courses.service.js";

class UserCoursesController {
  private coursesService: CoursesService;
  constructor(coursesServiceInstance: CoursesService) {
    this.coursesService = coursesServiceInstance;
  }

  async getHomeCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.coursesService.findPaginate(1);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async getCourseById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await this.coursesService.findById(id);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new UserCoursesController(coursesServiceInstance);
