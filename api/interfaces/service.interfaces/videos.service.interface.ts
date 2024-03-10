import mongoose from "mongoose";
import ServiceResponse from "../../types/serviceresponse.type.js";

export default interface IVideosService {
  create(
    video: Buffer,
    data: { title: string; course: string; chapter: string }
  ): ServiceResponse;

  count(
    chapter: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ count: number }>;

  edit(
    id: string,
    userId: string | mongoose.Types.ObjectId,
    data: { video: Buffer; title: string; order: number }
  ): ServiceResponse;

  deleteVideo(
    videoId: string,
    userId: string | mongoose.Types.ObjectId
  ): ServiceResponse;
}
