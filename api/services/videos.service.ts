import DatabaseId from "../types/databaseId.type.js";

import chaptersRepositoryInstance from "../repositories/chapters.repository.js";
import videosRepositoryInstance from "../repositories/videos.repository.js";
import coursesRepositoryInstance from "../repositories/courses.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import { uploadVideoToCloudinary } from "../utils/parser.js";
import { v2 as cloudinary } from "cloudinary";
import IVideosService from "../interfaces/service.interfaces/videos.service.interface.js";
import IVideosRepository from "../interfaces/repository.interfaces/videos.repository.interface.js";
import IChaptersRepository from "../interfaces/repository.interfaces/chapters.repository.interface.js";
import ICoursesRepository from "../interfaces/repository.interfaces/courses.repository.interface.js";

export class VideosService implements IVideosService {
  private videosRepository: IVideosRepository;
  private chaptersRepository: IChaptersRepository;
  private coursesRepository: ICoursesRepository;
  constructor(
    videosRepository: IVideosRepository,
    chaptersRepository: IChaptersRepository,
    coursesRepository: ICoursesRepository
  ) {
    this.videosRepository = videosRepository;
    this.chaptersRepository = chaptersRepository;
    this.coursesRepository = coursesRepository;
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
        public_id: string;
      };
      const chapter = await this.chaptersRepository.findOne({
        _id: data.chapter,
      });
      const order =
        (await this.videosRepository.count({ chapter: data.chapter })) + 1;
      const doc = await this.videosRepository.create({
        ...data,
        video: result.url,
        videoPublicId: result.public_id,
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
      console.log(error);
      throw error;
    }
  }

  async count(
    chapter: string | DatabaseId
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
      console.log(error);
      throw error;
    }
  }

  async edit(
    id: string,
    userId: string | DatabaseId,
    data: { video: Buffer; title: string; order: number }
  ): ServiceResponse {
    try {
      let updation: {
        title?: string;
        video?: string;
        duration?: number;
        videoPublicId?: string;
        order?: number;
      } = { title: data.title };
      const oldDoc = await this.videosRepository.findOne({ _id: id });
      const course = await this.coursesRepository.findById(
        oldDoc.course as string
      );
      if (course.tutor.toString() !== userId.toString()) {
        return {
          success: false,
          message: "You are not authorised to delete this course",
          statusCode: 401,
        };
      }
      if (data.video) {
        const result = (await uploadVideoToCloudinary(data.video)) as {
          url: string;
          duration: number;
          public_id: string;
        };
        updation = {
          ...updation,
          video: result.url,
          duration: result.duration,
          videoPublicId: result.public_id,
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
      console.log(error);
      throw error;
    }
  }

  async deleteVideo(
    videoId: string,
    userId: string | DatabaseId
  ): ServiceResponse {
    try {
      const doc = await this.videosRepository.findOne({ _id: videoId });
      const course = await this.coursesRepository.findById(
        doc.course as string
      );
      if (course.tutor.toString() !== userId.toString()) {
        return {
          success: false,
          message: "You are not authorised to delete this course",
          statusCode: 401,
        };
      }
      const deletedDoc = await this.coursesRepository.deleteOne({
        _id: videoId,
      });
      if (deletedDoc) {
        await this.videosRepository.updateMany(
          { order: { $gt: doc.order } },
          { $inc: { order: -1 } }
        );
        await cloudinary.uploader.destroy(doc.videoPublicId, {
          resource_type: "video",
        });
      }
      return {
        success: true,
        message: "Video deleted successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new VideosService(
  videosRepositoryInstance,
  chaptersRepositoryInstance,
  coursesRepositoryInstance
);
