import { Request, Response, NextFunction } from "express";
import customError from "../../utils/error.js";
import exercisesServiceInstance from "../../services/exercises.service.js";
import IExercisesService from "../../interfaces/service.interfaces/exercises.service.interface.js";

class TutorController {
  private exercisesService: IExercisesService;
  constructor(exercisesService: IExercisesService) {
    this.exercisesService = exercisesService;
  }
  async add(req: Request, res: Response, next: NextFunction) {
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

  async edit(req: Request, res: Response, next: NextFunction) {
    try {
      const { exerciseId } = req.params;
      const { question, answer, options, chapter, order } = req.body;
      const response = await this.exercisesService.edit(exerciseId, {
        question,
        answer,
        options,
        chapter,
        order,
      });
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    {
      try {
        const { exerciseId } = req.params;
        const response = await this.exercisesService.deleteExercise(exerciseId);
        res.status(response.statusCode).json(response);
      } catch (error) {
        next(customError(500, error.message));
      }
    }
  }

  async getCount(req: Request, res: Response, next: NextFunction) {
    try {
      const { chapterId } = req.params;
      const response = await this.exercisesService.count(chapterId);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new TutorController(exercisesServiceInstance);
