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
import chaptersServiceInstance, {
  ChaptersService,
} from "../../services/chapters.service.js";
import exercisesServiceInstance, {
  ExercisesService,
} from "../../services/exercises.service.js";
import videosServiceInstance, {
  VideosService,
} from "../../services/videos.service.js";
class TutorController {
  private coursesService: CoursesService;
  private categoriesService: CategoriesService;
  private chaptersService: ChaptersService;
  private exercisesService: ExercisesService;
  private videosService: VideosService;
  constructor(
    coursesService: CoursesService,
    categoriesService: CategoriesService,
    chaptersService: ChaptersService,
    exercisesService: ExercisesService,
    videosService: VideosService
  ) {
    this.coursesService = coursesService;
    this.categoriesService = categoriesService;
    this.chaptersService = chaptersService;
    this.exercisesService = exercisesService;
    this.videosService = videosService;
  }

  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.coursesService.find({ tutor: req.user._id });
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
        req.file?.buffer,
        req.user._id
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

  async createChapter(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.chaptersService.create(req.body);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async createExercise(req: Request, res: Response, next: NextFunction) {
    try {
      const { course, chapter, question, answer, options } = req.body;
      const response = await this.exercisesService.create({
        course,
        chapter,
        question,
        answer,
        order: 0,
        options,
      });
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async addVideo(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, course, chapter } = req.body;
      const response = await this.videosService.create(req.file.buffer, {
        title,
        course,
        chapter,
      });
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new TutorController(
  coursesServiceInstance,
  categoriesServiceInstance,
  chaptersServiceInstance,
  exercisesServiceInstance,
  videosServiceInstance
);
