import mongoose from "mongoose";
import PaginationResult from "../../types/PaginationResult.js";
import ServiceResponse from "../../types/serviceresponse.type.js";
import ICurrentUser from "../currentUser.interface.js";

export default interface ICoursesService {
  findByMultipleCategories(
    userData: ICurrentUser
  ): ServiceResponse<{ results: object[] }>;

  find(query: object): ServiceResponse<{ docs?: object[] }>;

  findPaginate(
    page: number,
    userId: string | mongoose.Types.ObjectId,
    filter?: {
      search?: string;
      minPrice: number;
      maxPrice: number;
      category?: string;
      language?: string;
      sort?: string;
    },
    limit?: number
  ): ServiceResponse<PaginationResult>;

  findById(
    id: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ doc?: object }>;

  create(
    data: {
      title: string;
      description: string;
      price: number;
      discount: number;
      category: mongoose.Types.ObjectId | string;
      tutor: mongoose.Types.ObjectId | string;
      requirements: string[];
      benefits: string[];
      language: string;
      thumbnail?: string;
      imagePublicId?: string;
    },
    image: Buffer
  ): ServiceResponse;

  edit(
    id: string,
    data: {
      title: string;
      description: string;
      price: number;
      discount: number;
      thumbnail: string;
      category: mongoose.Types.ObjectId | string;
      tutor: mongoose.Types.ObjectId | string;
      requirements: string[];
      benefits: string[];
      language: string;
    },
    image: Buffer | undefined,
    userId: string | mongoose.Types.ObjectId
  ): ServiceResponse;

  editPriceDiscount(
    userId: string | mongoose.Types.ObjectId,
    courseId: string,
    data: { price: number; discount: number }
  ): ServiceResponse;

  deleteCourse(id: string, userId: string): ServiceResponse;

  getPurchasedCourses(
    userId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ courses: object[] }>;

  getChapterRedirectInfo(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId,
    chapterId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ nextResource?: string }>;

  getVideoDetails(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId,
    chapterId: string | mongoose.Types.ObjectId,
    videoOrder: number
  ): ServiceResponse<{
    video?: object;
    nextData?: {
      nextVideo?: boolean;
      nextExercise?: Boolean;
      nextChapter?: boolean | string | mongoose.Types.ObjectId;
    };
  }>;

  getExerciseDetails(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId,
    chapterId: string | mongoose.Types.ObjectId,
    exerciseOrder: number
  ): ServiceResponse<{
    exercise?: object;
    nextData?: {
      nextExercise?: boolean;
      nextChapter?: boolean | string | mongoose.Types.ObjectId;
    };
  }>;

  getCreating(
    userId?: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ courses: object[] }>;

  getPending(
    userId?: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ courses: object[] }>;

  getPublished(
    userId?: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ courses: object[] }>;

  makePublishRequest(
    courseId: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId
  ): ServiceResponse;

  cancelPublishRequest(
    courseId: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId
  ): ServiceResponse;

  approveCourse(courseId: string | mongoose.Types.ObjectId): ServiceResponse;

  rejectCourse(courseId: string | mongoose.Types.ObjectId): ServiceResponse;

  blockCourse(courseId: string | mongoose.Types.ObjectId): ServiceResponse;

  unblockCourse(courseId: string | mongoose.Types.ObjectId): ServiceResponse;
}
