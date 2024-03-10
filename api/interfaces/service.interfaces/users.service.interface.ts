import mongoose from "mongoose";
import ServiceResponse from "../../types/serviceresponse.type.js";
import PaginationResult from "../../types/PaginationResult.js";

export default interface IUsersService {
  findAll(
    currentUserEmail: string,
    page: number
  ): ServiceResponse<PaginationResult>;

  findById(
    id: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ user?: object }>;

  addInterests(
    _id: string | mongoose.Types.ObjectId,
    interests: string[]
  ): ServiceResponse<{ user: object }>;

  sendChangeEmailVerification(email: string): ServiceResponse;

  editProfile(
    userId: string | mongoose.Types.ObjectId,
    data: { email: string; code?: number; name: string; bio: string }
  ): ServiceResponse;

  changeProfileImage(
    userId: string | mongoose.Types.ObjectId,
    image: Buffer
  ): ServiceResponse;

  changeBlockStatus(email: string, blockStatus: boolean): ServiceResponse;
}
