import { Request, Response, NextFunction, response } from "express";
import coursesServiceInstance, {
  CoursesService,
} from "../../services/courses.service.js";
import customError from "../../utils/error.js";
import { uploadtoCloudinary } from "../../utils/parser.js";

class TutorController {
  private coursesService: CoursesService;
  constructor(coursesService: CoursesService) {
    this.coursesService = coursesService;
  }

  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.coursesService.findPaginate(
        Number(req.query.page) || 1
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("req", req.file);
      console.log("req body:", req.body);
      const { title, description, price, category, requirements, benefits } =
        req.body;
      const author = req.user._id;
      const { url } = (await uploadtoCloudinary(req.file)) as { url: string };
      console.log("thumbnail", url);
      const response = await this.coursesService.create({
        title,
        description,
        price,
        requirements,
        category,
        benefits,
        author,
        thumbnail: url,
      });
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new TutorController(coursesServiceInstance);
