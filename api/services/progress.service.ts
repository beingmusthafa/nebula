import { error } from "console";
import progressRepositoryInstance, {
  ProgressRepository,
} from "../repositories/progress.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import mongoose from "mongoose";
import videosRepositoryInstance, {
  VideosRepository,
} from "../repositories/videos.repository.js";
import exercisesRepositoryInstance, {
  ExercisesRepository,
} from "../repositories/exercises.repository.js";
import ICourses from "../interfaces/courses.interface.js";

export class ProgressService {
  private progressRepository: ProgressRepository;
  private videosRepository: VideosRepository;
  private exercisesRepository: ExercisesRepository;
  constructor(
    progressRepository: ProgressRepository,
    videosRepository: VideosRepository,
    exercisesRepository: ExercisesRepository
  ) {
    this.progressRepository = progressRepository;
    this.videosRepository = videosRepository;
    this.exercisesRepository = exercisesRepository;
  }

  async getAllProgress(
    userId: string | mongoose.Types.ObjectId
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
      throw error;
    }
  }

  async createMultipleCourseProgress(
    userId: string | mongoose.Types.ObjectId,
    courseIds: string[] | mongoose.Types.ObjectId[]
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
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId
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
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId,
    videoId: string | mongoose.Types.ObjectId
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
      throw error;
    }
  }
  async addExerciseProgress(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId,
    exerciseId: string | mongoose.Types.ObjectId
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
      throw error;
    }
  }
}

export default new ProgressService(
  progressRepositoryInstance,
  videosRepositoryInstance,
  exercisesRepositoryInstance
);
