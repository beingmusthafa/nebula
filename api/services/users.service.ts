import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import UsersInterface from "../interfaces/users.interface.js";
import usersRepositoryInstance, {
  UsersRepository,
} from "../repositories/users.repository.js";
import mongoose from "mongoose";

export class UsersService {
  private usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async findAll(
    currentUserEmail: string,
    page: number
  ): Promise<{
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
      nextPage: number;
      prevPage: number;
    };
  }> {
    try {
      console.log("reached service");
      const docs = await this.usersRepository.find(
        { email: { $ne: currentUserEmail } },
        { limit: 3, skip: 3 * (page - 1) }
      );
      const totalCount = await this.usersRepository.count({
        email: { $ne: currentUserEmail },
      });
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

  async findById(id: string | mongoose.Types.ObjectId): Promise<{
    success: boolean;
    message: string;
    statusCode: number;
    doc?: object;
  }> {
    const doc = await this.usersRepository.findById(id, { password: 0 });
    if (!doc) {
      return {
        success: false,
        message: "user not found",
        statusCode: 404,
      };
    }
    return {
      success: true,
      message: "fetched doc successfully",
      statusCode: 200,
      doc,
    };
  }

  async changeBlockStatus(
    email: string,
    blockStatus: boolean
  ): Promise<{
    success: boolean;
    message: string;
    statusCode: number;
  }> {
    try {
      await this.usersRepository.findOneAndUpdate(
        { email },
        { isBlocked: blockStatus }
      );
      const message = blockStatus
        ? "user blocked successfully"
        : "user unblocked successfully";
      return { success: true, message, statusCode: 201 };
    } catch (error) {
      throw error;
    }
  }
}

export default new UsersService(usersRepositoryInstance);
