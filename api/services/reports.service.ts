import mongoose from "mongoose";
import adminReportsRepositoryInstance from "../repositories/adminReports.repository.js";
import tutorReportsRepositoryInstance from "../repositories/tutorReports.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import { generateReportPdf } from "../utils/pdf.js";
import IReportsInterface from "../interfaces/service.interfaces/reports.service.interface.js";
import IAdminReportsRepository from "../interfaces/repository.interfaces/adminReports.repository.interface.js";
import ITutorReportsRepository from "../interfaces/repository.interfaces/tutorReports.repository.interface.js";
export class ReportsService implements IReportsInterface {
  private adminReportsRepository: IAdminReportsRepository;
  private tutorReportsRepository: ITutorReportsRepository;
  private pdfGenerator: (
    report: any,
    type: "admin" | "tutor"
  ) => Promise<Buffer>;
  constructor(
    adminReportsRepository: IAdminReportsRepository,
    tutorReportsRepository: ITutorReportsRepository,
    pdfGenerator: (report: any, type: "admin" | "tutor") => Promise<Buffer>
  ) {
    this.adminReportsRepository = adminReportsRepository;
    this.tutorReportsRepository = tutorReportsRepository;
    this.pdfGenerator = pdfGenerator;
  }

  async getAdminPdfBuffer(
    reportId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ pdfBuffer: string }> {
    try {
      const report = await this.adminReportsRepository.findOne({
        _id: reportId,
      });
      const buffer = await this.pdfGenerator(report, "admin");
      if (!buffer) throw new Error("Error generating PDF");
      return {
        success: true,
        message: "Report PDF generated successfully",
        statusCode: 200,
        pdfBuffer: buffer.toString("base64"),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getTutorPdfBuffer(
    reportId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ pdfBuffer: string }> {
    try {
      const report = await this.tutorReportsRepository.findOne({
        _id: reportId,
      });
      const buffer = await this.pdfGenerator(report, "tutor");
      if (!buffer) throw new Error("Error generating PDF");
      return {
        success: true,
        message: "Report PDF generated successfully",
        statusCode: 200,
        pdfBuffer: buffer.toString("base64"),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAdminReport(
    reportId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ report: object }> {
    try {
      const report = await this.adminReportsRepository.findOne({
        _id: reportId,
      });
      return {
        success: true,
        message: "Report fetched successfully",
        statusCode: 200,
        report,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findTutorReport(
    reportId: string | mongoose.Types.ObjectId,
    tutorId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ report: object }> {
    try {
      const report = await this.tutorReportsRepository.findOne({
        _id: reportId,
        tutor: tutorId,
      });
      return {
        success: true,
        message: "Report fetched successfully",
        statusCode: 200,
        report,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAdminReports(
    type: "weekly" | "monthly" | "yearly"
  ): ServiceResponse<{ reports: object[] }> {
    try {
      const reports = await this.adminReportsRepository.find({ type });
      return {
        success: true,
        message: "Reports fetched successfully",
        statusCode: 200,
        reports,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getTutorReports(
    type: "weekly" | "monthly" | "yearly",
    tutorId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ reports: object[] }> {
    try {
      const reports = await this.tutorReportsRepository.find({
        tutor: tutorId,
        type,
      });
      return {
        success: true,
        message: "Reports fetched successfully",
        statusCode: 200,
        reports,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new ReportsService(
  adminReportsRepositoryInstance,
  tutorReportsRepositoryInstance,
  generateReportPdf
);
