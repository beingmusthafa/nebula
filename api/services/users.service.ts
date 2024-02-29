import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import UsersInterface from "../interfaces/users.interface.js";
import usersRepositoryInstance, {
  UsersRepository,
} from "../repositories/users.repository.js";
import otpsRepositoryInstance, {
  OtpsRepository,
} from "../repositories/otps.repository.js";
import mongoose from "mongoose";
import ServiceResponse from "../types/serviceresponse.type.js";
import PaginationResult from "../types/PaginationResult.js";
import mailer, { Mailer } from "../utils/mailer.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadtoCloudinary } from "../utils/parser.js";
import { resizeImage } from "../utils/cropper.js";

export class UsersService {
  private usersRepository: UsersRepository;
  private otpsRepository: OtpsRepository;
  private mailer: Mailer;

  constructor(
    usersRepository: UsersRepository,
    otpsRepository: OtpsRepository,
    mailer: Mailer
  ) {
    this.usersRepository = usersRepository;
    this.otpsRepository = otpsRepository;
    this.mailer = mailer;
  }

  async findAll(
    currentUserEmail: string,
    page: number
  ): ServiceResponse<PaginationResult> {
    try {
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
      console.log(error);
      throw error;
    }
  }

  async findById(
    id: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ user?: object }> {
    const doc = await this.usersRepository.findById(id, { password: 0 });
    if (!doc) {
      return {
        success: false,
        message: "user not found",
        statusCode: 404,
      };
    }
    const { password: _password, ...rest } = doc;
    return {
      success: true,
      message: "fetched doc successfully",
      statusCode: 200,
      user: rest,
    };
  }

  async changeBlockStatus(
    email: string,
    blockStatus: boolean
  ): ServiceResponse {
    try {
      await this.usersRepository.updateOne(
        { email },
        { $set: { isBlocked: blockStatus } }
      );
      const message = blockStatus
        ? "user blocked successfully"
        : "user unblocked successfully";
      return { success: true, message, statusCode: 201 };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addInterests(
    _id: string | mongoose.Types.ObjectId,
    interests: string[]
  ): ServiceResponse<{ user: object }> {
    try {
      const newData = await this.usersRepository.updateOne(
        { _id },
        { $addToSet: { interests: { $each: interests } } }
      );
      const { password: _password, ...rest } = newData;
      return {
        success: true,
        message: "interests added successfully",
        statusCode: 201,
        user: rest,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async sendChangeEmailVerification(email: string) {
    try {
      if (!email) {
        return {
          success: false,
          message: "Email is required",
          statusCode: 400,
        };
      }
      const emailExists = await this.usersRepository.findByEmail(email);
      if (emailExists) {
        return {
          success: false,
          message: "Email already exists",
          statusCode: 400,
        };
      }
      const code = Math.floor(100000 + Math.random() * 900000);
      await this.otpsRepository.create(email, code);
      await this.mailer.sendVerificationMail(email, code);
      return {
        success: true,
        message: "email change verification sent successfully",
        statusCode: 201,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async editProfile(
    userId: string | mongoose.Types.ObjectId,
    data: { email: string; code?: number; name: string; bio: string }
  ): ServiceResponse {
    try {
      const { email, code, name, bio } = data;
      const user = await this.usersRepository.findById(userId);
      if (user.email !== email) {
        const verificationCode = await this.otpsRepository.findOne({
          email,
          code,
        });
        if (!verificationCode) {
          return {
            success: false,
            message: "invalid verification code",
            statusCode: 400,
          };
        }
      }
      await this.usersRepository.updateOne(
        { _id: userId },
        { $set: { name, bio, email } }
      );
      return {
        success: true,
        message: "profile updated successfully",
        statusCode: 201,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async changeProfileImage(
    userId: string | mongoose.Types.ObjectId,
    image: Buffer
  ): ServiceResponse {
    let newImagePublicId: string;
    try {
      const user = await this.usersRepository.findById(userId);
      const croppedImage = await resizeImage(image, 400, 400);
      const { url, public_id } = (await uploadtoCloudinary(croppedImage)) as {
        url: string;
        public_id: string;
      };
      newImagePublicId = public_id;
      if (user.imagePublicId) {
        await cloudinary.uploader.destroy(user.imagePublicId);
      }
      await this.usersRepository.updateOne(
        { _id: userId },
        { $set: { image: url, imagePublicId: public_id } }
      );
      return {
        success: true,
        message: "Profile image changed successfully",
        statusCode: 201,
      };
    } catch (error) {
      await cloudinary.uploader
        .destroy(newImagePublicId)
        .catch((error) => console.log(error));
      console.log(error);
      throw error;
    }
  }
}

export default new UsersService(
  usersRepositoryInstance,
  otpsRepositoryInstance,
  mailer
);
