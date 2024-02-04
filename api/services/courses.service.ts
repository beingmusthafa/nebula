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

  async getAll(page: number): Promise<{
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
      const docs = await this.coursesRepository.find();
      const totalCount = await this.coursesRepository.count();
      return {
        success: true,
        message: "fetched docs successfully",
        statusCode: 200,
        result: {
          docs,
          total: docs.length,
          limit: 3,
          page,
          pages: Math.ceil(totalCount / 3),
          hasNextPage: page < Math.ceil(totalCount / 3),
          hasPrevPage: page > 1,
          nextPage: page + 1,
          prevPage: page - 1,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string | mongoose.Types.ObjectId) {
    try {
      return await this.coursesRepository.findById(id);
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
