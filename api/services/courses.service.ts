import mongoose from "mongoose";
import coursesRepositoryInstance, {
  CoursesRepository,
} from "../repositories/courses.repository.js";
import ICourses from "../interfaces/courses.interface.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import PaginationResult from "../types/PaginationResult.js";
import { resizeImage } from "../utils/cropper.js";
import { uploadtoCloudinary } from "../utils/parser.js";
import categoriesRepositoryInstance, {
  CategoriesRepository,
} from "../repositories/categories.repository.js";
import chaptersRepositoryInstance, {
  ChaptersRepository,
} from "../repositories/chapters.repository.js";
import videosRepositoryInstance, {
  VideosRepository,
} from "../repositories/videos.repository.js";
import exercisesRepositoryInstance, {
  ExercisesRepository,
} from "../repositories/exercises.repository.js";
import purchasesRepositoryInstance, {
  PurchasesRepository,
} from "../repositories/purchases.repository.js";
import { v2 as cloudinary } from "cloudinary";

export class CoursesService {
  private coursesRepository: CoursesRepository;
  private categoriesRepository: CategoriesRepository;
  private chaptersRepository: ChaptersRepository;
  private videosRepository: VideosRepository;
  private exercisesRepository: ExercisesRepository;
  private purchasesRepository: PurchasesRepository;
  constructor(
    coursesRepository: CoursesRepository,
    categoriesRepository: CategoriesRepository,
    chaptersRepository: ChaptersRepository,
    videosRepository: VideosRepository,
    exercisesRepository: ExercisesRepository,
    purchasesRepository: PurchasesRepository
  ) {
    this.coursesRepository = coursesRepository;
    this.categoriesRepository = categoriesRepository;
    this.chaptersRepository = chaptersRepository;
    this.videosRepository = videosRepository;
    this.exercisesRepository = exercisesRepository;
    this.purchasesRepository = purchasesRepository;
  }

  async findByMultipleCategories(
    interests?: string[] | mongoose.Types.ObjectId[]
  ): ServiceResponse<{ results: object[] }> {
    try {
      console.log("interests:::", interests);
      const filter = interests
        ? {
            _id: { $in: interests },
          }
        : {};
      const categories = await this.categoriesRepository.find(filter, {
        projection: "_id name",
        limit: 5,
      });
      let queries = categories.map(async (category) => {
        const courses = await this.coursesRepository.find(
          {
            category: category._id,
          },
          { populate: { path: "tutor", select: "name image" } }
        );
        return {
          category: category.name,
          courses,
        };
      });
      const results = await Promise.all(queries);
      console.log("result:::", results.toString());
      return {
        success: true,
        message: "fetched docs successfully",
        statusCode: 200,
        results,
      };
    } catch (error) {
      throw error;
    }
  }

  async find(query: object): ServiceResponse<{ docs?: object[] }> {
    try {
      const docs = await this.coursesRepository.find(query);
      return {
        success: true,
        message: "fetched docs successfully",
        statusCode: 200,
        docs,
      };
    } catch (error) {
      throw error;
    }
  }

  async findPaginate(
    page: number,
    userId: string | mongoose.Types.ObjectId = null,
    filter?: {
      search?: string;
      minPrice: number;
      maxPrice: number;
      category?: string;
      language?: string;
      sort?: string;
    }
  ): ServiceResponse<PaginationResult> {
    try {
      let options = {};
      let query = {};
      if (userId) {
        const purchasedCourses = await this.purchasesRepository.find(
          { user: userId },
          { projection: "course" }
        );
        const purchasedCoursesIds = purchasedCourses.map(
          (purchase) => purchase.course
        );
        query = {
          _id: {
            $nin: purchasedCoursesIds,
          },
        };
      }
      if (filter?.search) {
        query = {
          title: { $regex: new RegExp(filter?.search), $options: "i" },
        };
      }
      query = {
        ...query,
        price: {
          $gte: filter?.minPrice >= 0 ? filter?.minPrice : 0,
          $lte: filter?.maxPrice <= 99999 ? filter?.maxPrice : 99999,
        },
      };
      if (filter?.category) {
        const doc = await this.categoriesRepository.findOne({
          name: filter?.category,
        });
        query = { ...query, category: doc._id };
      }
      if (filter?.language) {
        query = { ...query, language: filter?.language };
      }
      if (filter?.sort) {
        const sort =
          filter?.sort === "newest"
            ? { createdAt: -1 }
            : filter?.sort === "rating"
            ? { rating: -1 }
            : filter?.sort === "price_low"
            ? { price: 1 }
            : { price: -1 };
        options = { sort };
      }
      const docs = await this.coursesRepository.find(query, {
        ...options,
        populate: { path: "tutor", select: "name image" },
        limit: 8,
        skip: (page - 1) * 8,
      });
      const totalCount = await this.coursesRepository.count(query);
      return {
        success: true,
        message: "fetched docs successfully",
        statusCode: 200,
        result: {
          docs,
          total: totalCount,
          limit: 8,
          page,
          pages: Math.ceil(totalCount / 8),
          hasNextPage: page < Math.ceil(totalCount / 8),
          hasPrevPage: page > 1,
          nextPage: page + 1,
          prevPage: page - 1,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async findById(
    id: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ doc?: object }> {
    try {
      const doc = await this.coursesRepository.findById(id, {
        populate: { path: "tutor", select: "name image bio" },
      });
      if (!doc) {
        return {
          success: false,
          message: "course not found",
          statusCode: 404,
        };
      }
      return {
        success: true,
        message: "fetched doc successfully",
        statusCode: 200,
        doc,
      };
    } catch (error) {
      throw error;
    }
  }

  async create(
    data: {
      title: string;
      description: string;
      price: number;
      category: mongoose.Types.ObjectId | string;
      tutor: mongoose.Types.ObjectId | string;
      requirements: string[];
      benefits: string[];
      language: string;
      thumbnail?: string;
      imagePublicId?: string;
    },
    image: Buffer
  ): ServiceResponse {
    try {
      if (data.title.length < 3)
        return {
          success: false,
          message: "Title must be at least 3 characters",
          statusCode: 400,
        };
      if (data.title.length > 50)
        return {
          success: false,
          message: "Title must be at most 50 characters",
          statusCode: 400,
        };
      if (data.description.length < 20)
        return {
          success: false,
          message: "Description must be at least 20 characters",
          statusCode: 400,
        };
      if (data.description.length > 1000)
        return {
          success: false,
          message: "Description must be at most 1000 characters",
          statusCode: 400,
        };
      if (data.price < 0)
        return {
          success: false,
          message: "Price must be at least 0",
          statusCode: 400,
        };
      if (data.price > 99999) {
        return {
          success: false,
          message: "Price must be at most 99999",
          statusCode: 400,
        };
      }
      const croppedBuffer = await resizeImage(image, 800, 450);
      const result = (await uploadtoCloudinary(croppedBuffer)) as {
        url: string;
        public_id: string;
      };
      data.thumbnail = result.url;
      data.imagePublicId = result.public_id;
      if (!data.requirements) data.requirements = [];
      if (!data.benefits) data.benefits = [];
      await this.coursesRepository.create(data as ICourses);
      return {
        success: true,
        message: "created doc successfully",
        statusCode: 201,
      };
    } catch (error) {
      throw error;
    }
  }

  async edit(
    id: string,
    data: {
      title: string;
      description: string;
      price: number;
      thumbnail: string;
      category: mongoose.Types.ObjectId | string;
      tutor: mongoose.Types.ObjectId | string;
      requirements: string[];
      benefits: string[];
      language: string;
    },
    image: Buffer | undefined,
    currentUserId: string | mongoose.Types.ObjectId
  ): ServiceResponse {
    try {
      const existingDoc = await this.coursesRepository.findById(id);
      if (existingDoc.tutor.toString() !== currentUserId.toString())
        return {
          success: false,
          message: "You are not authorized to edit this course",
          statusCode: 401,
        };
      if (data.title.length < 3)
        return {
          success: false,
          message: "Title must be at least 3 characters",
          statusCode: 400,
        };
      if (data.title.length > 50)
        return {
          success: false,
          message: "Title must be at most 50 characters",
          statusCode: 400,
        };
      if (data.description.length < 20)
        return {
          success: false,
          message: "Description must be at least 20 characters",
          statusCode: 400,
        };
      if (data.description.length > 1000)
        return {
          success: false,
          message: "Description must be at most 1000 characters",
          statusCode: 400,
        };
      if (data.price < 0)
        return {
          success: false,
          message: "Price must be at least 0",
          statusCode: 400,
        };
      if (data.price > 99999) {
        return {
          success: false,
          message: "Price must be at most 99999",
          statusCode: 400,
        };
      }
      let imageData: { thumbnail?: string; imagePublicId?: string } = {};
      if (image) {
        const croppedBuffer = await resizeImage(image, 800, 450);
        const { url, public_id } = (await uploadtoCloudinary(
          croppedBuffer
        )) as {
          url: string;
          public_id: string;
        };
        imageData.thumbnail = url;
        imageData.imagePublicId = public_id;
      } else {
        delete data.thumbnail;
      }
      if (!data.requirements) data.requirements = [];
      if (!data.benefits) data.benefits = [];
      await this.coursesRepository.findOneAndUpdate(
        { _id: id },
        { ...data, ...imageData }
      );
      return {
        success: true,
        message: "Edited doc successfully",
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteCourse(id: string, userId: string): ServiceResponse {
    try {
      const existingDoc = await this.coursesRepository.findById(id);
      if (existingDoc.tutor.toString() !== userId)
        return {
          success: false,
          message: "You are not authorized to delete this course",
          statusCode: 401,
        };
      await this.coursesRepository.deleteOne({ _id: id });
      await cloudinary.uploader.destroy(existingDoc.imagePublicId);
      const videos = await this.videosRepository.find({ course: id });
      videos.forEach(async (video) => {
        await cloudinary.uploader.destroy(video.videoPublicId, {
          resource_type: "video",
        });
      });
      await this.videosRepository.delete({ course: id });
      await this.exercisesRepository.delete({ course: id });
      return {
        success: true,
        message: "Deleted course and contents successfully",
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }
}
export default new CoursesService(
  coursesRepositoryInstance,
  categoriesRepositoryInstance,
  chaptersRepositoryInstance,
  videosRepositoryInstance,
  exercisesRepositoryInstance,
  purchasesRepositoryInstance
);
