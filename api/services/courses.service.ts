import mongoose from "mongoose";
import coursesRepositoryInstance, {
  CoursesRepository,
} from "../repositories/courses.repository.js";
import CoursesInterface from "../interfaces/courses.interface.js";

export class CoursesService {
  private coursesRepository: CoursesRepository;

  constructor(coursesRepository: CoursesRepository) {
    this.coursesRepository = coursesRepository;
  }

  async findPaginate(page: number): Promise<{
    success: boolean;
    message: string;
    statusCode: number;
    result?: {
      docs: object[];
      total: number;
      limit: number;
      page: number;
      pages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextPage?: number;
      prevPage?: number;
    };
  }> {
    try {
      const docs = await this.coursesRepository.find(
        {},
        { populate: { path: "author", select: "name image bio" } }
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

  async findById(id: string | mongoose.Types.ObjectId): Promise<{
    success: boolean;
    message: string;
    statusCode: number;
    doc?: object;
  }> {
    try {
      const doc = await this.coursesRepository.findById(id, {
        populate: { path: "author", select: "name image bio" },
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
    data: CoursesInterface
  ): Promise<{ success: boolean; message: string; statusCode: number }> {
    try {
      await this.coursesRepository.create(data);
      return {
        success: true,
        message: "created doc successfully",
        statusCode: 201,
      };
    } catch (error) {
      throw error;
    }
  }
}
export default new CoursesService(coursesRepositoryInstance);
