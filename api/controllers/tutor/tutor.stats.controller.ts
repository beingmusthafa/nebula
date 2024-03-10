import { Request, Response, NextFunction } from "express";
import enrollmentsServiceInstance from "../../services/enrollments.service.js";
import reportsServiceInstance from "../../services/reports.service.js";
import customError from "../../utils/error.js";
import IEnrollmentsService from "../../interfaces/service.interfaces/enrollments.service.interface.js";
import IReportsInterface from "../../interfaces/service.interfaces/reports.service.interface.js";

class TutorStatsController {
  private enrollmentsService: IEnrollmentsService;
  private reportsService: IReportsInterface;
  constructor(
    enrollmentsService: IEnrollmentsService,
    reportsService: IReportsInterface
  ) {
    this.enrollmentsService = enrollmentsService;
    this.reportsService = reportsService;
  }

  async getGraphData(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.enrollmentsService.getGraphData(
        req.session.user._id
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  //   async getMonthlyStats(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const response = await this.enrollmentsService.getMonthlyStats(
  //         req.session.user._id
  //       );
  //       res.status(response.statusCode).json(response);
  //     } catch (error) {
  //       next(customError(500, error.message));
  //     }
  //   }

  async getTopCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.enrollmentsService.getTopCourses(
        req.session.user._id
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async getReport(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.reportsService.findTutorReport(
        req.params.reportId,
        req.session.user._id
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async getWeeklyReports(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.reportsService.getTutorReports(
        "weekly",
        req.session.user._id
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
  async getMonthlyReports(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.reportsService.getTutorReports(
        "monthly",
        req.session.user._id
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
  async getYearlyReports(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.reportsService.getTutorReports(
        "yearly",
        req.session.user._id
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async getReportPdfBuffer(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.reportsService.getTutorPdfBuffer(
        req.params.reportId
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new TutorStatsController(
  enrollmentsServiceInstance,
  reportsServiceInstance
);
