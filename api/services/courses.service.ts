import mongoose from "mongoose";
import coursesRepositoryInstance, {
  CoursesRepository,
} from "../repositories/courses.repository.js";
import ICourses from "../interfaces/courses.interface.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import PaginationResult from "../types/PaginationResult.js";
import { resizeImage } from "../utils/cropper.js";
import { uploadtoCloudinary } from "../utils/parser.js";

export class CoursesService {
  private coursesRepository: CoursesRepository;

  constructor(coursesRepository: CoursesRepository) {
    this.coursesRepository = coursesRepository;
  }

  async find(query: object): ServiceResponse<{ docs?: object[] }> {
    try {
      const docs = await this.coursesRepository.find(query);
      return {
        success: true,
        message: "fetched docs successfully",
        statusCode: 200,
        docs,
      };
    } catch (error) {
      throw error;
    }
  }

  async findPaginate(
    page: number
    // search: string,
    // filter: { minPrice?: number; maxPrice?: number; sort?: string }
  ): ServiceResponse<PaginationResult> {
    try {
      const docs = await this.coursesRepository.find(
        {},
        { populate: { path: "tutor", select: "name image bio" } }
      );
      const totalCount = await this.coursesRepository.count();
      return {
        success: true,
        message: "fetched docs successfully",
        statusCode: 200,
        result: {
          docs,
          total: docs.length,
          limit: 20,
          page,
          pages: Math.ceil(totalCount / 20),
          hasNextPage: page < Math.ceil(totalCount / 20),
          hasPrevPage: page > 1,
          nextPage: page + 1,
          prevPage: page - 1,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async findById(
    id: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ doc?: object }> {
    try {
      const doc = await this.coursesRepository.findById(id, {
        populate: { path: "tutor", select: "name image bio" },
      });
      if (!doc) {
        return {
          success: false,
          message: "course not found",
          statusCode: 404,
        };
      }
      return {
        success: true,
        message: "fetched doc successfully",
        statusCode: 200,
        doc,
      };
    } catch (error) {
      throw error;
    }
  }

  async create(
    data: {
      title: string;
      description: string;
      price: number;
      category: mongoose.Types.ObjectId | string;
      tutor: mongoose.Types.ObjectId | string;
      requirements: string[];
      benefits: string[];
      language: string;
      thumbnail?: string;
    },
    image: Buffer
  ): ServiceResponse {
    try {
      if (data.title.length < 3)
        return {
          success: false,
          message: "Title must be at least 3 characters",
          statusCode: 400,
        };
      if (data.title.length > 50)
        return {
          success: false,
          message: "Title must be at most 50 characters",
          statusCode: 400,
        };
      if (data.description.length < 20)
        return {
          success: false,
          message: "Description must be at least 20 characters",
          statusCode: 400,
        };
      if (data.description.length > 1000)
        return {
          success: false,
          message: "Description must be at most 1000 characters",
          statusCode: 400,
        };
      const croppedBuffer = await resizeImage(image, 800, 450);
      const { url } = (await uploadtoCloudinary(croppedBuffer)) as {
        url: string;
      };
      data.thumbnail = url;
      if (!data.requirements) data.requirements = [];
      if (!data.benefits) data.benefits = [];
      await this.coursesRepository.create(data as ICourses);
      return {
        success: true,
        message: "created doc successfully",
        statusCode: 201,
      };
    } catch (error) {
      throw error;
    }
  }

  async edit(
    id: string,
    data: {
      title: string;
      description: string;
      price: number;
      thumbnail: string;
      category: mongoose.Types.ObjectId | string;
      tutor: mongoose.Types.ObjectId | string;
      requirements: string[];
      benefits: string[];
      language: string;
    },
    image: Buffer | undefined
  ): ServiceResponse {
    try {
      if (data.title.length < 3)
        return {
          success: false,
          message: "Title must be at least 3 characters",
          statusCode: 400,
        };
      if (data.title.length > 50)
        return {
          success: false,
          message: "Title must be at most 50 characters",
          statusCode: 400,
        };
      if (data.description.length < 20)
        return {
          success: false,
          message: "Description must be at least 20 characters",
          statusCode: 400,
        };
      if (data.description.length > 1000)
        return {
          success: false,
          message: "Description must be at most 1000 characters",
          statusCode: 400,
        };
      if (image) {
        const croppedBuffer = await resizeImage(image, 800, 450);
        const { url } = (await uploadtoCloudinary(croppedBuffer)) as {
          url: string;
        };
        data.thumbnail = url;
      } else {
        delete data.thumbnail;
      }
      if (!data.requirements) data.requirements = [];
      if (!data.benefits) data.benefits = [];
      await this.coursesRepository.findOneAndUpdate({ _id: id }, data);
      return {
        success: true,
        message: "Edited doc successfully",
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }
}
export default new CoursesService(coursesRepositoryInstance);
