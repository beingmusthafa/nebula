import DatabaseId from "../types/databaseId.type.js";

import IExercises from "../interfaces/exercises.interface.js";
import chaptersRepositoryInstance from "../repositories/chapters.repository.js";
import exercisesRepositoryInstance from "../repositories/exercises.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import IExercisesService from "../interfaces/service.interfaces/exercises.service.interface.js";
import IExercisesRepository from "../interfaces/repository.interfaces/exercises.repository.interface.js";
import IChaptersRepository from "../interfaces/repository.interfaces/chapters.repository.interface.js";

export class ExercisesService implements IExercisesService {
  private exercisesRepository: IExercisesRepository;
  private chaptersRepository: IChaptersRepository;
  constructor(
    exercisesRepository: IExercisesRepository,
    chaptersRepository: IChaptersRepository
  ) {
    this.exercisesRepository = exercisesRepository;
    this.chaptersRepository = chaptersRepository;
  }

  async create(exercise: IExercises): ServiceResponse {
    try {
      if (exercise.question.trim().length < 5) {
        return {
          success: false,
          message: "Question must be at least 5 characters",
          statusCode: 400,
        };
      }
      const chapter = await this.chaptersRepository.findOne({
        _id: exercise.chapter,
      });
      const order =
        (await this.exercisesRepository.count({ chapter: exercise.chapter })) +
        1;
      const doc = await this.exercisesRepository.create({
        ...exercise,
        order,
        chapter: chapter._id,
        course: chapter.course as string,
      });
      return {
        success: true,
        message: "Exercise created successfully",
        statusCode: 201,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async edit(
    id: string,
    exercise: {
      question: string;
      options: string[];
      chapter: string | DatabaseId;
      order: number;
      answer: "A" | "B" | "C" | "D";
    }
  ): ServiceResponse {
    try {
      if (exercise.order) {
        const existingOrder = await this.exercisesRepository.findOne({
          order: exercise.order,
          chapter: exercise.chapter,
        });
        const doc = await this.exercisesRepository.findOne({ _id: id });
        await this.exercisesRepository.updateOne(
          { _id: existingOrder._id },
          { $set: { order: doc.order } }
        );
      } else {
        delete exercise.order;
      }
      await this.exercisesRepository.updateOne({ _id: id }, { $set: exercise });
      return {
        success: true,
        message: "Exercise updated successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async count(
    chapter: string | DatabaseId
  ): ServiceResponse<{ count: number }> {
    try {
      const count = await this.exercisesRepository.count({ chapter });
      return {
        success: true,
        message: "Exercises count fetched successfully",
        statusCode: 200,
        count,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteExercise(id: string): ServiceResponse {
    try {
      const doc = await this.exercisesRepository.deleteOne({ _id: id });
      return {
        success: true,
        message: "Exercise deleted successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new ExercisesService(
  exercisesRepositoryInstance,
  chaptersRepositoryInstance
);
