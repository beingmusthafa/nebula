import mongoose from "mongoose";
import ServiceResponse from "../../types/serviceresponse.type.js";

export default interface IProgressService {
  getAllProgress(
    userId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ progressList: object[] }>;

  createMultipleCourseProgress(
    userId: string | mongoose.Types.ObjectId,
    courseIds: string[] | mongoose.Types.ObjectId[]
  ): ServiceResponse;

  getCourseProgress(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ progress: object }>;

  addExerciseProgress(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId,
    exerciseId: string | mongoose.Types.ObjectId
  );
}
