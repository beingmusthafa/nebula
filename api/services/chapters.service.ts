import mongoose from "mongoose";
import IChapters from "../interfaces/chapters.interface.js";
import chaptersRepositoryInstance, {
  ChaptersRepository,
} from "../repositories/chapters.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import exercisesRepositoryInstance, {
  ExercisesRepository,
} from "../repositories/exercises.repository.js";
import videosRepositoryInstance, {
  VideosRepository,
} from "../repositories/videos.repository.js";
import { v2 as cloudinary } from "cloudinary";

export class ChaptersService {
  private chaptersRepository: ChaptersRepository;
  private exercisesRepository: ExercisesRepository;
  private videosRepository: VideosRepository;
  constructor(
    chaptersRepository: ChaptersRepository,
    exercisesRepository: ExercisesRepository,
    videosRepository: VideosRepository
  ) {
    this.chaptersRepository = chaptersRepository;
    this.exercisesRepository = exercisesRepository;
    this.videosRepository = videosRepository;
  }

  async getByCourse(
    course: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ chapters: object[] }> {
    try {
      const chapters = await this.chaptersRepository.find(
        { course },
        {
          sort: { order: 1 },
          lean: true,
        }
      );
      let result = await Promise.all(
        chapters.map(async (chapter) => {
          const exercises = await this.exercisesRepository.find(
            {
              chapter: chapter._id,
            },
            { sort: { order: 1 } }
          );
          const videos = await this.videosRepository.find(
            {
              chapter: chapter._id,
            },
            { sort: { order: 1 } }
          );
          return { ...chapter, exercises, videos };
        })
      );

      return {
        success: true,
        message: "Chapters fetched successfully",
        statusCode: 200,
        chapters: result,
      };
    } catch (error) {
      throw error;
    }
  }

  async create(chapter: IChapters): ServiceResponse {
    try {
      if (chapter.title.trim().length < 5) {
        return {
          success: false,
          message: "Title must be at least 5 characters",
          statusCode: 400,
        };
      }
      if (chapter.title.trim().length > 100) {
        return {
          success: false,
          message: "Title must be at most 100 characters",
          statusCode: 400,
        };
      }
      const nameExists = await this.chaptersRepository.findOne({
        title: chapter.title,
        course: chapter.course,
      });
      if (nameExists)
        return {
          success: false,
          message: "Chapter already exists",
          statusCode: 400,
        };
      const order =
        (await this.chaptersRepository.count({ course: chapter.course })) + 1;
      await this.chaptersRepository.create({ ...chapter, order });
      return {
        success: true,
        message: "Chapter created successfully",
        statusCode: 201,
      };
    } catch (error) {
      throw error;
    }
  }

  async edit(
    id: string,
    chapter?: { title?: string; order?: number }
  ): ServiceResponse {
    try {
      if (chapter.order) {
        const existingOrder = await this.chaptersRepository.findOne({
          order: chapter.order,
        });
        const doc = await this.chaptersRepository.findOne({ _id: id });
        await this.chaptersRepository.updateOne(
          { _id: existingOrder._id },
          { $set: { order: doc.order } }
        );
      } else {
        delete chapter.order;
      }
      const doc = await this.chaptersRepository.findOne({ _id: id });
      const nameExists = await this.chaptersRepository.findOne({
        title: doc.title,
        course: doc.course,
      });
      if (nameExists)
        return {
          success: false,
          message: "Chapter already exists",
          statusCode: 400,
        };
      await this.chaptersRepository.updateOne({ _id: id }, { $set: chapter });
      return {
        success: true,
        message: "Chapter updated successfully",
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteChapter(id: string): ServiceResponse {
    try {
      const doc = await this.chaptersRepository.deleteOne(id);
      await this.chaptersRepository.update(
        { course: doc.course, order: { $gt: doc.order } },
        { $inc: { order: -1 } }
      );
      const videos = await this.videosRepository.find({ chapter: doc._id });
      videos.forEach(async (video) => {
        await cloudinary.uploader.destroy(video.videoPublicId, {
          resource_type: "video",
        });
      });
      await this.videosRepository.delete({ chapter: doc._id });
      await this.exercisesRepository.delete({ chapter: doc._id });
      return {
        success: true,
        message: "Chapter deleted successfully",
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  async count(
    course: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ count: number }> {
    try {
      const count = await this.chaptersRepository.count({ course });
      return {
        success: true,
        message: "Count fetched successfully",
        statusCode: 200,
        count,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new ChaptersService(
  chaptersRepositoryInstance,
  exercisesRepositoryInstance,
  videosRepositoryInstance
);
