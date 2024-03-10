import mongoose from "mongoose";
import ServiceResponse from "../../types/serviceresponse.type.js";

export default interface IReportsInterface {
  getAdminPdfBuffer(
    reportId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ pdfBuffer: string }>;

  getTutorPdfBuffer(
    reportId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ pdfBuffer: string }>;

  findAdminReport(
    reportId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ report: object }>;

  findTutorReport(
    reportId: string | mongoose.Types.ObjectId,
    tutorId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ report: object }>;

  getAdminReports(
    type: "weekly" | "monthly" | "yearly"
  ): ServiceResponse<{ reports: object[] }>;

  getTutorReports(
    type: "weekly" | "monthly" | "yearly",
    tutorId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ reports: object[] }>;
}
