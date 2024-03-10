import mongoose from "mongoose";
import ServiceResponse from "../../types/serviceresponse.type.js";

export default interface IEnrollmentsService {
  createCheckoutSession(
    userId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ sessionId?: string }>;

  confirmPurchase(eventHeader: string | string[], requestBody: string);

  getEnrollments(
    userId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ enrollments: object[] }>;

  getGraphData(
    tutorId?: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ courseEnrollmentData: object[] }>;

  getTopCourses(
    tutorId?: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ courses: object[] }>;
}
