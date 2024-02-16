import IExercises from "../interfaces/exercises.interface.js";
import IVideos from "../interfaces/videos.interface.js";
import videosRepositoryInstance, {
  VideosRepository,
} from "../repositories/videos.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import { uploadVideoToCloudinary } from "../utils/parser.js";

export class VideosService {
  private videosRepository: VideosRepository;
  constructor(videosRepository: VideosRepository) {
    this.videosRepository = videosRepository;
  }

  async create(
    video: Buffer,
    data: { title: string; course: string; chapter: string }
  ): ServiceResponse {
    try {
      console.log({ video });
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
      const order = (await this.videosRepository.count()) + 1;
      await this.videosRepository.create({
        ...data,
        video: result.url,
        duration: Math.floor(result.duration),
        order,
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
}

export default new VideosService(videosRepositoryInstance);
