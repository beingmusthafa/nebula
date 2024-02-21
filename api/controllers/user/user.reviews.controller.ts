import { Request, Response, NextFunction } from "express";
import customError from "../../utils/error.js";
import reviewsServiceInstance, {
  ReviewsService,
} from "../../services/reviews.service.js";

class UsersReviewsController {
  private reviewsService: ReviewsService;
  constructor(reviewsService: ReviewsService) {
    this.reviewsService = reviewsService;
  }

  async getReviews(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("reached:::");
      const { courseId } = req.params;
      const response = await this.reviewsService.getReviews(courseId);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async addReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { course, rating, comment } = req.body;
      const response = await this.reviewsService.addReview({
        user: req.user._id,
        course,
        rating: Number(rating),
        comment,
      });
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async editReview(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.originalUrl);
      const { reviewId } = req.params;
      const { rating, comment } = req.body;
      const response = await this.reviewsService.editReview(reviewId, {
        rating,
        comment,
      });
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }

  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { reviewId } = req.params;
      const response = await this.reviewsService.deleteReview(reviewId);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(customError(500, error.message));
    }
  }
}

export default new UsersReviewsController(reviewsServiceInstance);
