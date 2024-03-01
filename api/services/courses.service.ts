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
import enrollmentsRepositoryInstance, {
  EnrollmentsRepository,
} from "../repositories/enrollments.repository.js";
import { v2 as cloudinary } from "cloudinary";
import ICurrentUser from "../interfaces/currentUser.interface.js";

export class CoursesService {
  private coursesRepository: CoursesRepository;
  private categoriesRepository: CategoriesRepository;
  private chaptersRepository: ChaptersRepository;
  private videosRepository: VideosRepository;
  private exercisesRepository: ExercisesRepository;
  private enrollmentsRepository: EnrollmentsRepository;
  constructor(
    coursesRepository: CoursesRepository,
    categoriesRepository: CategoriesRepository,
    chaptersRepository: ChaptersRepository,
    videosRepository: VideosRepository,
    exercisesRepository: ExercisesRepository,
    enrollmentsRepository: EnrollmentsRepository
  ) {
    this.coursesRepository = coursesRepository;
    this.categoriesRepository = categoriesRepository;
    this.chaptersRepository = chaptersRepository;
    this.videosRepository = videosRepository;
    this.exercisesRepository = exercisesRepository;
    this.enrollmentsRepository = enrollmentsRepository;
  }

  async findByMultipleCategories(
    userData?: ICurrentUser
  ): ServiceResponse<{ results: object[] }> {
    try {
      let categoryFilter: any = {};
      let coursesFilter: any = {};
      if (userData) {
        categoryFilter = {
          _id: { $in: userData.interests },
        };
        const purchasedCourses = await this.enrollmentsRepository.find(
          { user: userData._id },
          { projection: "course" }
        );
        const createdCourses = await this.coursesRepository.find(
          { tutor: userData._id },
          { projection: "_id" }
        );
        const createdCoursesIds = createdCourses.map((course) => course._id);
        const purchasedCoursesIds = purchasedCourses.map(
          (purchase) => purchase.course
        );
        coursesFilter = {
          _id: {
            $nin: [...purchasedCoursesIds, ...createdCoursesIds],
          },
        };
      }
      const categories = await this.categoriesRepository.find(categoryFilter, {
        projection: "_id name",
        limit: 5,
      });

      let queries = categories.map(async (category) => {
        const courses = await this.coursesRepository.find(
          {
            ...coursesFilter,
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
      return {
        success: true,
        message: "fetched docs successfully",
        statusCode: 200,
        results,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async find(query: object): ServiceResponse<{ docs?: object[] }> {
    try {
      const filter = { ...query, status: "published" };
      const docs = await this.coursesRepository.find(filter);
      return {
        success: true,
        message: "fetched docs successfully",
        statusCode: 200,
        docs,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findPaginate(
    page: number,
    userId: string | mongoose.Types.ObjectId,
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
        const purchasedCourses = await this.enrollmentsRepository.find(
          { user: userId },
          { projection: "course" }
        );
        const createdCourses = await this.coursesRepository.find(
          { tutor: userId },
          { projection: "_id" }
        );
        const createdCoursesIds = createdCourses.map((course) => course._id);
        const purchasedCoursesIds = purchasedCourses.map(
          (purchase) => purchase.course
        );
        query = {
          _id: {
            $nin: [...purchasedCoursesIds, ...createdCoursesIds],
          },
        };
      }
      if (filter?.search) {
        query = {
          ...query,
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
      query = {
        ...query,
        status: "published",
      };
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
      console.log(error);
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
      console.log(error);
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
      console.log(error);
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
    userId: string | mongoose.Types.ObjectId
  ): ServiceResponse {
    try {
      const existingDoc = await this.coursesRepository.findById(id);
      if (existingDoc.tutor.toString() !== userId) {
        return {
          success: false,
          message: "You are not authorized to delete this course",
          statusCode: 401,
        };
      }
      if (existingDoc.status !== "creating") {
        return {
          success: false,
          message: "You can only delete a course that is being created",
          statusCode: 400,
        };
      }
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
      console.log(error);
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
      if (existingDoc.status !== "creating") {
        return {
          success: false,
          message: "You can only delete a course that is being created",
          statusCode: 400,
        };
      }
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
      console.log(error);
      throw error;
    }
  }

  async getPurchasedCourses(
    userId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ courses: object[] }> {
    try {
      const purchasedCourses = await this.enrollmentsRepository.find(
        { user: userId },
        { projection: "course" }
      );
      const courses = await this.coursesRepository.find(
        {
          _id: { $in: purchasedCourses.map((course) => course.course) },
        },
        { populate: { path: "tutor", select: "name image" } }
      );
      return {
        success: true,
        message: "Fetched purchased courses successfully",
        statusCode: 200,
        courses,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getChapterRedirectInfo(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId,
    chapterId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ nextResource?: string }> {
    try {
      const enrolled = await this.enrollmentsRepository.findOne({
        user: userId,
        course: courseId,
      });
      if (!enrolled) {
        return {
          success: false,
          message: "You are not enrolled in this course",
          statusCode: 401,
        };
      }
      let resourceType = "";
      let resourceId = "";
      const videoExists = await this.videosRepository.findOne({
        course: courseId,
        chapter: chapterId,
        order: 1,
      });
      if (videoExists) {
        resourceType = "video";
        resourceId = videoExists._id.toString();
        return {
          success: true,
          message: "Fetched initial redirect info successfully",
          statusCode: 200,
          nextResource: resourceType,
        };
      }
      const exerciseExists = await this.exercisesRepository.findOne({
        course: courseId,
        chapter: chapterId,
        order: 1,
      });
      if (exerciseExists) {
        resourceType = "exercise";
        resourceId = exerciseExists._id.toString();
        return {
          success: true,
          message: "Fetched initial redirect info successfully",
          statusCode: 200,
          nextResource: resourceType,
        };
      }
      return {
        success: false,
        message: "No resources found",
        statusCode: 404,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getVideoDetails(
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
  }> {
    try {
      let nextData: {
        nextVideo?: boolean;
        nextExercise?: Boolean;
        nextChapter?: boolean | string | mongoose.Types.ObjectId;
      } = {
        nextVideo: false,
        nextExercise: false,
        nextChapter: false,
      };
      const video = await this.videosRepository.findOne({
        course: courseId,
        chapter: chapterId,
        order: videoOrder,
      });
      if (!video) {
        return {
          success: false,
          message: "No video found",
          statusCode: 404,
        };
      }
      const nextVideo = await this.videosRepository.findOne({
        course: courseId,
        chapter: chapterId,
        order: videoOrder + 1,
      });
      if (nextVideo) {
        nextData.nextVideo = true;
        return {
          success: true,
          message: "Fetched video details successfully",
          statusCode: 200,
          video,
          nextData,
        };
      }
      const nextExercise = await this.exercisesRepository.findOne({
        course: courseId,
        chapter: chapterId,
      });
      if (nextExercise) {
        nextData.nextExercise = true;
        return {
          success: true,
          message: "Fetched video details successfully",
          statusCode: 200,
          video,
          nextData,
        };
      }
      const currentChapter = await this.chaptersRepository.findOne({
        _id: chapterId,
      });
      const nextChapter = await this.chaptersRepository.findOne({
        course: courseId,
        order: currentChapter.order + 1,
      });
      if (nextChapter) {
        nextData.nextChapter = nextChapter._id;
        return {
          success: true,
          message: "Fetched video details successfully",
          statusCode: 200,
          video,
          nextData,
        };
      }
      return {
        success: true,
        message: "No further resource found",
        statusCode: 200,
        video,
        nextData,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getExerciseDetails(
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
  }> {
    try {
      let nextData: any = {
        nextExercise: false,
        nextChapter: false,
      };
      const exercise = await this.exercisesRepository.findOne({
        course: courseId,
        chapter: chapterId,
        order: exerciseOrder,
      });
      if (!exercise) {
        return {
          success: false,
          message: "No exercise found",
          statusCode: 404,
        };
      }
      const nextExercise = await this.exercisesRepository.findOne({
        course: courseId,
        chapter: chapterId,
        order: exerciseOrder + 1,
      });
      if (nextExercise) {
        nextData.nextExercise = true;
        return {
          success: true,
          message: "Fetched video details successfully",
          statusCode: 200,
          exercise,
          nextData,
        };
      }
      const currentChapter = await this.chaptersRepository.findOne({
        _id: chapterId,
      });
      const nextChapter = await this.chaptersRepository.findOne({
        course: courseId,
        order: currentChapter.order + 1,
      });
      if (nextChapter) {
        nextData.nextChapter = nextChapter._id;
        return {
          success: true,
          message: "Fetched video details successfully",
          statusCode: 200,
          exercise,
          nextData,
        };
      }
      return {
        success: false,
        message: "No further resource found",
        statusCode: 200,
        exercise,
        nextData,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getCreating(
    userId?: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ courses: object[] }> {
    try {
      let filter: any = {
        status: "creating",
      };
      if (userId) filter = { ...filter, tutor: userId.toString() };
      const courses = await this.coursesRepository.find(filter);
      return {
        success: true,
        message: "Fetched creating courses successfully",
        statusCode: 200,
        courses,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getPending(
    userId?: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ courses: object[] }> {
    try {
      let filter: any = {
        status: "pending",
      };
      if (userId) filter = { ...filter, tutor: userId.toString() };
      const courses = await this.coursesRepository.find(filter);
      return {
        success: true,
        message: "Fetched pending courses successfully",
        statusCode: 200,
        courses,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getPublished(
    userId?: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ courses: object[] }> {
    try {
      let filter: any = {
        status: "published",
      };
      if (userId) filter = { ...filter, tutor: userId.toString() };
      const courses = await this.coursesRepository.find(filter);
      return {
        success: true,
        message: "Fetched pending courses successfully",
        statusCode: 200,
        courses,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async makePublishRequest(
    courseId: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId
  ): ServiceResponse {
    try {
      const course = await this.coursesRepository.findById(courseId);
      if (course.tutor.toString() !== userId.toString()) {
        return {
          success: false,
          message: "You are not authorized to push this course for approval",
          statusCode: 401,
        };
      }
      if (course.status !== "creating") {
        return {
          success: false,
          message: "Invalid action",
          statusCode: 400,
        };
      }
      await this.coursesRepository.updateOne(
        { _id: courseId },
        { status: "pending" }
      );
      return {
        success: true,
        message: "Course pushed for approval successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async cancelPublishRequest(
    courseId: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId
  ): ServiceResponse {
    try {
      const course = await this.coursesRepository.findById(courseId);
      if (course.tutor.toString() !== userId.toString()) {
        return {
          success: false,
          message: "You are not authorized to cancel approval request",
          statusCode: 401,
        };
      }
      if (course.status !== "pending") {
        return {
          success: false,
          message: "Invalid action",
          statusCode: 400,
        };
      }
      await this.coursesRepository.updateOne(
        { _id: courseId },
        { status: "creating" }
      );
      return {
        success: true,
        message: "Course approval request cancelled",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async approveCourse(
    courseId: string | mongoose.Types.ObjectId
  ): ServiceResponse {
    try {
      const course = await this.coursesRepository.findById(courseId);
      if (course.status !== "pending") {
        return {
          success: false,
          message: "Invalid action",
          statusCode: 400,
        };
      }
      await this.coursesRepository.updateOne(
        { _id: courseId },
        { status: "published" }
      );
      return {
        success: true,
        message: "Course approved successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async rejectCourse(
    courseId: string | mongoose.Types.ObjectId
  ): ServiceResponse {
    try {
      const course = await this.coursesRepository.findById(courseId);
      if (course.status !== "pending") {
        return {
          success: false,
          message: "Invalid action",
          statusCode: 400,
        };
      }
      await this.coursesRepository.updateOne(
        { _id: courseId },
        { status: "creating" }
      );
      return {
        success: true,
        message: "Course rejected successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async blockCourse(
    courseId: string | mongoose.Types.ObjectId
  ): ServiceResponse {
    try {
      await this.coursesRepository.updateOne(
        { _id: courseId },
        { isBlocked: true }
      );
      return {
        success: true,
        message: "Course blocked successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async unblockCourse(
    courseId: string | mongoose.Types.ObjectId
  ): ServiceResponse {
    try {
      await this.coursesRepository.updateOne(
        { _id: courseId },
        { isBlocked: false }
      );
      return {
        success: true,
        message: "Course blocked successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async changePricing(
    courseId: string | mongoose.Types.ObjectId,
    userId: string | mongoose.Types.ObjectId,
    data: { price: number; discount: number }
  ): ServiceResponse {
    try {
      const course = await this.coursesRepository.findById(courseId);
      if (course.tutor.toString() !== userId) {
        return {
          success: false,
          message: "You are not authorized to change pricing",
          statusCode: 401,
        };
      }
      await this.coursesRepository.updateOne({ _id: courseId }, data);
      return {
        success: true,
        message: "Pricing changed successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
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
  enrollmentsRepositoryInstance
);
