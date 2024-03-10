import { Request, Response, NextFunction } from "express";
import customError from "../../utils/error.js";
import chaptersServiceInstance from "../../services/chapters.service.js";
import IChaptersService from "../../interfaces/service.interfaces/chapters.service.interface.js";

class TutorController {
  private chaptersService: IChaptersService;

  constructor(chaptersService: IChaptersService) {
    this.chaptersService = chaptersService;
  }

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.chaptersService.create(req.body);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async getByCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const response = await this.chaptersService.getByCourse(courseId);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async countByCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const response = await this.chaptersService.count(courseId);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async edit(req: Request, res: Response, next: NextFunction) {
    try {
      const { chapterId } = req.params;
      const { title, order } = req.body;
      const response = await this.chaptersService.edit(chapterId, {
        title,
        order,
      });
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { chapterId } = req.params;
      const response = await this.chaptersService.deleteChapter(chapterId);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new TutorController(chaptersServiceInstance);
