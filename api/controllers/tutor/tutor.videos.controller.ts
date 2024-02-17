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

  async getVideoCount(req: Request, res: Response, next: NextFunction) {
    try {
      const { chapterId } = req.params;
      const response = await this.videosService.count(chapterId);
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
