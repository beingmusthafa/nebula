import { Request, Response, NextFunction } from "express";
import coursesServiceInstance from "../../services/courses.service.js";
import customError from "../../utils/error.js";
import categoriesServiceInstance from "../../services/categories.service.js";
import chaptersServiceInstance from "../../services/chapters.service.js";
import ICoursesService from "../../interfaces/service.interfaces/courses.service.interface.js";
import ICategoriesService from "../../interfaces/service.interfaces/categories.service.interface.js";
import IChaptersService from "../../interfaces/service.interfaces/chapters.service.interface.js";

class TutorController {
  private coursesService: ICoursesService;
  private categoriesService: ICategoriesService;
  private chaptersService: IChaptersService;
  constructor(
    coursesService: ICoursesService,
    categoriesService: ICategoriesService,
    chaptersService: IChaptersService
  ) {
    this.coursesService = coursesService;
    this.categoriesService = categoriesService;
    this.chaptersService = chaptersService;
  }

  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.coursesService.find({
        tutor: req.session.user._id,
      });
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
        discount,
        category,
        requirements,
        benefits,
        language,
      } = req.body;
      const tutor = req.session.user._id;
      const response = await this.coursesService.create(
        {
          title,
          description,
          price: Number(price),
          discount: Number(discount),
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
        req.file?.buffer,
        req.session.user._id
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
      const { chapters } = await this.chaptersService.getByCourse(id);
      res.status(response.statusCode).json({ ...response, chapters });
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const response = await this.coursesService.deleteCourse(
        courseId,
        req.session.user._id as string
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async getCreating(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.coursesService.getCreating(
        req.session.user._id
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async getPending(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.coursesService.getPending(
        req.session.user._id
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async getPublished(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.coursesService.getPublished(
        req.session.user._id
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async makePublishRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const response = await this.coursesService.makePublishRequest(
        courseId,
        req.session.user._id
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async cancelPublishRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const response = await this.coursesService.cancelPublishRequest(
        courseId,
        req.session.user._id
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async editPriceDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const { price, discount } = req.body;
      const response = await this.coursesService.editPriceDiscount(
        req.session.user._id,
        courseId,
        { price: Number(price), discount: Number(discount) }
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new TutorController(
  coursesServiceInstance,
  categoriesServiceInstance,
  chaptersServiceInstance
);
