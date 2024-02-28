import { Request, Response, NextFunction } from "express";
import customError from "../../utils/error.js";
import coursesServiceInstance, {
  CoursesService,
} from "../../services/courses.service.js";
import categoriesServiceInstance, {
  CategoriesService,
} from "../../services/categories.service.js";
import chaptersServiceInstance, {
  ChaptersService,
} from "../../services/chapters.service.js";
import bannersServiceInstance, {
  BannersService,
} from "../../services/banners.service.js";
import messagesServiceInstance, {
  MessagesService,
} from "../../services/messages.service.js";

class UserCoursesController {
  private coursesService: CoursesService;
  private categoriesService: CategoriesService;
  private chaptersService: ChaptersService;
  private bannersService: BannersService;
  private messagesService: MessagesService;
  constructor(
    coursesService: CoursesService,
    categoriesService: CategoriesService,
    chaptersService: ChaptersService,
    bannersService: BannersService,
    messagesService: MessagesService
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
      const response = await this.bannersService.getBanners();
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
