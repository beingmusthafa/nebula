import { Request, Response, NextFunction, response } from "express";
import coursesServiceInstance, {
  CoursesService,
} from "../../services/courses.service.js";
import customError from "../../utils/error.js";
import { uploadtoCloudinary } from "../../utils/parser.js";
import categoriesServiceInstance, {
  CategoriesService,
} from "../../services/categories.service.js";
import { resizeImage } from "../../utils/cropper.js";

class TutorController {
  private coursesService: CoursesService;
  private categoriesService: CategoriesService;
  constructor(
    coursesService: CoursesService,
    categoriesService: CategoriesService
  ) {
    this.coursesService = coursesService;
    this.categoriesService = categoriesService;
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
      const {
        title,
        description,
        price,
        category,
        requirements,
        benefits,
        language,
      } = req.body;
      const tutor = req.user._id;
      const response = await this.coursesService.create(
        {
          title,
          description,
          price,
          requirements,
          category,
          benefits,
          tutor,
          language,
        },
        req.file.buffer
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async editCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;
      const response = await this.coursesService.edit(
        id,
        req.body,
        req.file?.buffer
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.categoriesService.getAll();
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async getDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await this.coursesService.findById(id);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new TutorController(
  coursesServiceInstance,
  categoriesServiceInstance
);
