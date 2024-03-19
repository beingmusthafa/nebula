import { error } from "console";
import progressRepositoryInstance from "../repositories/progress.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import DatabaseId from "../types/databaseId.type.js";

import videosRepositoryInstance from "../repositories/videos.repository.js";
import exercisesRepositoryInstance from "../repositories/exercises.repository.js";
import IProgressService from "../interfaces/service.interfaces/progress.service.interface.js";
import IProgressRepository from "../interfaces/repository.interfaces/progress.repository.interface.js";
import IVideosRepository from "../interfaces/repository.interfaces/videos.repository.interface.js";
import IExercisesRepository from "../interfaces/repository.interfaces/exercises.repository.interface.js";

export class ProgressService implements IProgressService {
  private progressRepository: IProgressRepository;
  private videosRepository: IVideosRepository;
  private exercisesRepository: IExercisesRepository;
  constructor(
    progressRepository: IProgressRepository,
    videosRepository: IVideosRepository,
    exercisesRepository: IExercisesRepository
  ) {
    this.progressRepository = progressRepository;
    this.videosRepository = videosRepository;
    this.exercisesRepository = exercisesRepository;
  }

  async getAllProgress(
    userId: string | DatabaseId
  ): ServiceResponse<{ progressList: object[] }> {
    try {
      const progressList = await this.progressRepository.find({ user: userId });
      return {
        success: true,
        message: "Fetched all progress",
        statusCode: 200,
        progressList,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createMultipleCourseProgress(
    userId: string | DatabaseId,
    courseIds: string[] | DatabaseId[]
  ): ServiceResponse {
    try {
      const progressData = await Promise.all(
        courseIds.map(async (courseId) => {
          const videoCountQuery = this.videosRepository.count({
            course: courseId,
          });
          const exerciseCountQuery = this.exercisesRepository.count({
            course: courseId,
          });
          const [videoCount, exerciseCount] = await Promise.all([
            videoCountQuery,
            exerciseCountQuery,
          ]);
          const count = videoCount + exerciseCount;
          return {
            user: userId,
            course: courseId,
            target: count,
          };
        })
      );
      await this.progressRepository.createMany(progressData);
      return {
        success: true,
        message: "Created progress records",
        statusCode: 201,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getCourseProgress(
    userId: string | DatabaseId,
    courseId: string | DatabaseId
  ): ServiceResponse<{ progress: object }> {
    try {
      const progress = await this.progressRepository.findOne({
        user: userId,
        course: courseId,
      });
      return {
        success: true,
        message: "Fetched course progress",
        statusCode: 200,
        progress,
      };
    } catch {
      throw error;
    }
  }

  async addVideoProgress(
    userId: string | DatabaseId,
    courseId: string | DatabaseId,
    videoId: string | DatabaseId
  ) {
    try {
      const validVideo = await this.videosRepository.findOne({
        _id: videoId,
        course: courseId,
      });
      if (!validVideo) {
        return {
          success: false,
          message: "Invalid video",
          statusCode: 400,
        };
      }
      const progress = await this.progressRepository.pushToField(
        { user: userId, course: courseId },
        "videos",
        videoId
      );
      return {
        success: true,
        message: "Added video to progress",
        statusCode: 200,
        progress,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async addExerciseProgress(
    userId: string | DatabaseId,
    courseId: string | DatabaseId,
    exerciseId: string | DatabaseId
  ) {
    try {
      const validExercise = await this.exercisesRepository.findOne({
        _id: exerciseId,
        course: courseId,
      });
      if (!validExercise) {
        return {
          success: false,
          message: "Invalid exercise",
          statusCode: 400,
        };
      }
      const progress = await this.progressRepository.pushToField(
        { user: userId, course: courseId },
        "exercises",
        exerciseId
      );
      return {
        success: true,
        message: "Added exercise to progress",
        statusCode: 200,
        progress,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new ProgressService(
  progressRepositoryInstance,
  videosRepositoryInstance,
  exercisesRepositoryInstance
);
