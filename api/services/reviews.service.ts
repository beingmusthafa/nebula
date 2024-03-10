import mongoose from "mongoose";
import reviewsRepositoryInstance, {
  ReviewsRepository,
} from "../repositories/reviews.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import path from "path";
import coursesRepositoryInstance, {
  CoursesRepository,
} from "../repositories/courses.repository.js";
import IReviewsService from "../interfaces/service.interfaces/reviews.service.interface.js";

export class ReviewsService implements IReviewsService {
  private reviewsRepository: ReviewsRepository;
  private coursesRepository: CoursesRepository;
  constructor(
    reviewsRepository: ReviewsRepository,
    coursesRepository: CoursesRepository
  ) {
    this.reviewsRepository = reviewsRepository;
    this.coursesRepository = coursesRepository;
  }

  private async updateAvgReview(courseId: string | mongoose.Types.ObjectId) {
    try {
      const reviews = await this.reviewsRepository.find(
        {
          course: courseId,
        },
        { projection: "rating" }
      );
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
          : 0;
      await this.coursesRepository.updateOne(
        { _id: courseId },
        { rating: avgRating }
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addReview(review: {
    user: mongoose.Types.ObjectId | string;
    course: string | mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
  }): ServiceResponse {
    try {
      review.comment = review.comment.trim();
      if (!review.comment) delete review.comment;
      else if (review.comment.length > 500) {
        return {
          success: true,
          message: "Comment cannot be more than 200 characters",
          statusCode: 400,
        };
      }
      if (review.rating > 5 || review.rating < 1) {
        return {
          success: true,
          message: "Rating must be between 1 and 5",
          statusCode: 400,
        };
      }
      const alreadyReviewed = await this.reviewsRepository.findOne({
        user: review.user,
        course: review.course,
      });
      if (alreadyReviewed) {
        return {
          success: true,
          message: "You have already reviewed this course",
          statusCode: 400,
        };
      }
      await this.reviewsRepository.create(review);
      await this.updateAvgReview(review.course);
      return {
        success: true,
        message: "Review added successfully",
        statusCode: 201,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async editReview(
    reviewId: string,
    data: { rating?: number; comment?: string }
  ): ServiceResponse {
    try {
      data.comment = data.comment?.trim();
      if (!data.comment) delete data.comment;
      if (data.comment?.length > 500) {
        return {
          success: true,
          message: "Comment cannot be more than 200 characters",
          statusCode: 400,
        };
      }
      if (data.rating > 5 || data.rating < 1) {
        return {
          success: true,
          message: "Rating must be between 1 and 5",
          statusCode: 400,
        };
      }
      await this.reviewsRepository.updateOne({ _id: reviewId }, data);
      const review = await this.reviewsRepository.findOne({ _id: reviewId });
      await this.updateAvgReview(review.course);
      return {
        success: true,
        message: "Review updated successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteReview(reviewId: string): ServiceResponse {
    try {
      const review = await this.reviewsRepository.findOne(
        { _id: reviewId },
        { projection: "course" }
      );
      await this.reviewsRepository.deleteOne({ _id: reviewId });
      await this.updateAvgReview(review.course);
      return {
        success: true,
        message: "Review deleted successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getReviews(courseId: string): ServiceResponse<{ reviews: object[] }> {
    try {
      const reviews = await this.reviewsRepository.find(
        { course: courseId },
        { populate: { path: "user", select: "name image" } }
      );
      return {
        success: true,
        message: "Reviews fetched successfully",
        statusCode: 200,
        reviews,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new ReviewsService(
  reviewsRepositoryInstance,
  coursesRepositoryInstance
);
