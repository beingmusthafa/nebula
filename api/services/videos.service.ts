import mongoose from "mongoose";
import IExercises from "../interfaces/exercises.interface.js";
import IVideos from "../interfaces/videos.interface.js";
import chaptersRepositoryInstance, {
  ChaptersRepository,
} from "../repositories/chapters.repository.js";
import videosRepositoryInstance, {
  VideosRepository,
} from "../repositories/videos.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import { uploadVideoToCloudinary } from "../utils/parser.js";

export class VideosService {
  private videosRepository: VideosRepository;
  private chaptersRepository: ChaptersRepository;
  constructor(
    videosRepository: VideosRepository,
    chaptersRepository: ChaptersRepository
  ) {
    this.videosRepository = videosRepository;
    this.chaptersRepository = chaptersRepository;
  }

  async create(
    video: Buffer,
    data: { title: string; course: string; chapter: string }
  ): ServiceResponse {
    try {
      if (!video) {
        return {
          success: false,
          message: "Video is required",
          statusCode: 400,
        };
      }
      if (data.title.trim().length < 5) {
        return {
          success: false,
          message: "Title must be at least 5 characters",
          statusCode: 400,
        };
      }
      if (data.title.trim().length > 75) {
        return {
          success: false,
          message: "Title must be at most 75 characters",
          statusCode: 400,
        };
      }
      const result = (await uploadVideoToCloudinary(video)) as {
        url: string;
        duration: number;
      };
      console.log({ result });
      const chapter = await this.chaptersRepository.findOne({
        _id: data.chapter,
      });
      const order =
        (await this.videosRepository.count({ chapter: data.chapter })) + 1;
      const doc = await this.videosRepository.create({
        ...data,
        video: result.url,
        duration: Math.floor(result.duration),
        order,
        chapter: chapter._id,
        course: chapter.course as string,
      });
      return {
        success: true,
        message: "Video added successfully",
        statusCode: 201,
      };
    } catch (error) {
      throw error;
    }
  }

  async count(
    chapter: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ count: number }> {
    try {
      const count = await this.videosRepository.count({ chapter });
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

  async edit(
    id: string,
    data: { video: Buffer; title: string; order: number }
  ) {
    console.log(id, data);
    try {
      let updation: {
        title?: string;
        video?: string;
        duration?: number;
        order?: number;
      } = { title: data.title };
      const oldDoc = await this.videosRepository.findOne({ _id: id });
      if (data.video) {
        const result = (await uploadVideoToCloudinary(data.video)) as {
          url: string;
          duration: number;
        };
        updation = {
          ...updation,
          video: result.url,
          duration: result.duration,
        };
      }
      if (data.order !== oldDoc.order) {
        await this.videosRepository.updateOne(
          { chapter: oldDoc.chapter, order: data.order },
          { $set: { order: oldDoc.order } }
        );
        updation = { ...updation, order: data.order };
      }
      await this.videosRepository.updateOne({ _id: id }, { $set: updation });
      return {
        success: true,
        message: "Video edited successfully",
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteVideo(id: string): ServiceResponse {
    try {
      const doc = await this.videosRepository.deleteOne({ _id: id });
      return {
        success: true,
        message: "Video deleted successfully",
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new VideosService(
  videosRepositoryInstance,
  chaptersRepositoryInstance
);
