import { Request, Response, NextFunction } from "express";
import customError from "../../utils/error.js";
import coursesServiceInstance from "../../services/courses.service.js";
import categoriesServiceInstance from "../../services/categories.service.js";
import chaptersServiceInstance from "../../services/chapters.service.js";
import bannersServiceInstance from "../../services/banners.service.js";
import messagesServiceInstance from "../../services/messages.service.js";
import ICoursesService from "../../interfaces/service.interfaces/courses.service.interface.js";
import ICategoriesService from "../../interfaces/service.interfaces/categories.service.interface.js";
import IChaptersService from "../../interfaces/service.interfaces/chapters.service.interface.js";
import IBannersService from "../../interfaces/service.interfaces/banners.service.interface.js";
import IMessagesService from "../../interfaces/service.interfaces/messages.service.interface.js";

class UserCoursesController {
  private coursesService: ICoursesService;
  private categoriesService: ICategoriesService;
  private chaptersService: IChaptersService;
  private bannersService: IBannersService;
  private messagesService: IMessagesService;
  constructor(
    coursesService: ICoursesService,
    categoriesService: ICategoriesService,
    chaptersService: IChaptersService,
    bannersService: IBannersService,
    messagesService: IMessagesService
  ) {
    this.coursesService = coursesService;
    this.categoriesService = categoriesService;
    this.chaptersService = chaptersService;
    this.bannersService = bannersService;
    this.messagesService = messagesService;
  }

  async getHomeData(req: Request, res: Response, next: NextFunction) {
    try {
      const { results } = await this.coursesService.findByMultipleCategories(
        req.session.user
      );
      const response = await this.bannersService.getBanners(true);
      res
        .status(response.statusCode)
        .json({ ...response, categories: results });
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async searchCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, search, minPrice, maxPrice, category, language, sort } =
        req.query;
      const response = await this.coursesService.findPaginate(
        Number(page) || 1,
        req.session.user?._id,
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

  async liveSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const { searchQuery } = req.params;
      const response = await this.coursesService.findPaginate(
        1,
        req.session.user?._id,
        {
          search: searchQuery as string,
          minPrice: 0,
          maxPrice: Infinity,
          category: "",
          language: "",
          sort: "",
        },
        3
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
      const { chapters } = await this.chaptersService.getByCourse(id);
      res.status(response.statusCode).json({ ...response, chapters });
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async getPurchasedCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.coursesService.getPurchasedCourses(
        req.session.user?._id
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

  async getChapterRedirectInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.coursesService.getChapterRedirectInfo(
        req.session.user?._id,
        req.params.courseId,
        req.params.chapterId
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async getVideoDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, chapterId, videoOrder } = req.params;
      const response = await this.coursesService.getVideoDetails(
        req.session.user?._id,
        courseId,
        chapterId,
        Number(videoOrder)
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async getExerciseDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, chapterId, exerciseOrder } = req.params;
      const response = await this.coursesService.getExerciseDetails(
        req.session.user?._id,
        courseId,
        chapterId,
        Number(exerciseOrder)
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async getRoomMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const response = await this.messagesService.findAll(
        req.session.user?._id,
        courseId
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new UserCoursesController(
  coursesServiceInstance,
  categoriesServiceInstance,
  chaptersServiceInstance,
  bannersServiceInstance,
  messagesServiceInstance
);
