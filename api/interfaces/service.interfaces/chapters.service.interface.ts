import mongoose from "mongoose";
import ServiceResponse from "../../types/serviceresponse.type.js";
import IChapters from "../chapters.interface.js";

export default interface IChaptersService {
  getByCourse(
    course: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ chapters: object[] }>;

  create(chapter: IChapters): ServiceResponse;

  edit(
    id: string,
    chapter?: { title?: string; order?: number }
  ): ServiceResponse;

  deleteChapter(id: string): ServiceResponse;

  count(
    course: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ count: number }>;
}
