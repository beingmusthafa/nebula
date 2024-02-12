import { Request, Response, NextFunction } from "express";
import customError from "../../utils/error.js";
import coursesServiceInstance, {
  CoursesService,
} from "../../services/courses.service.js";
import categoriesServiceInstance, {
  CategoriesService,
} from "../../services/categories.service.js";

class UserCoursesController {
  private coursesService: CoursesService;
  private categoriesService: CategoriesService;
  constructor(
    coursesService: CoursesService,
    categoriesService: CategoriesService
  ) {
    this.coursesService = coursesService;
    this.categoriesService = categoriesService;
  }

  async getHomeCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.coursesService.findPaginate(1);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async searchCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, search, minPrice, maxPrice, category, language, sort } =
        req.query;
      console.log({
        search,
        page,
        minPrice,
        maxPrice,
        category,
        language,
        sort,
      });
      const response = await this.coursesService.findPaginate(
        Number(page) || 1,
        {
          search: search as string,
          minPrice: Number(minPrice) || 0,
          maxPrice: Number(maxPrice) || Infinity,
          category: category as string,
          language: language as string,
          sort: sort as string,
        }
      );
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

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.categoriesService.getAll();
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new UserCoursesController(
  coursesServiceInstance,
  categoriesServiceInstance
);
