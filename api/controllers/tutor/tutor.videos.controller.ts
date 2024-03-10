import { Request, Response, NextFunction } from "express";
import customError from "../../utils/error.js";
import videosServiceInstance from "../../services/videos.service.js";
import IVideosService from "../../interfaces/service.interfaces/videos.service.interface.js";
class TutorController {
  private videosService: IVideosService;
  constructor(videosService: IVideosService) {
    this.videosService = videosService;
  }

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, course, chapter } = req.body;
      const response = await this.videosService.create(req.file?.buffer, {
        title,
        course,
        chapter,
      });
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async edit(req: Request, res: Response, next: NextFunction) {
    try {
      const { videoId } = req.params;
      const response = await this.videosService.edit(
        videoId,
        req.session.user._id,
        {
          title: req.body.title,
          order: req.body.order,
          video: req.file?.buffer,
        }
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async deleteVideo(req: Request, res: Response, next: NextFunction) {
    try {
      const { videoId } = req.params;
      const response = await this.videosService.deleteVideo(
        videoId,
        req.session.user._id
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async getCount(req: Request, res: Response, next: NextFunction) {
    try {
      const { chapterId } = req.params;
      const response = await this.videosService.count(chapterId);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new TutorController(videosServiceInstance);
