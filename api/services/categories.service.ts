import ICategories from "../interfaces/categories.interface.js";
import categoriesRepositoryInstance, {
  CategoriesRepository,
} from "../repositories/categories.repository.js";
import coursesRepositoryInstance, {
  CoursesRepository,
} from "../repositories/courses.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import { resizeImage } from "../utils/cropper.js";
import { uploadtoCloudinary } from "../utils/parser.js";

export class CategoriesService {
  private categoriesRepository: CategoriesRepository;
  private coursesRepository: CoursesRepository;
  constructor(
    categoriesRepository: CategoriesRepository,
    coursesRepository: CoursesRepository
  ) {
    this.categoriesRepository = categoriesRepository;
    this.coursesRepository = coursesRepository;
  }

  async getAll(): ServiceResponse<{ categories?: ICategories[] }> {
    try {
      const docs = await this.categoriesRepository.find();
      return {
        success: true,
        message: "fetched docs successfully",
        statusCode: 200,
        categories: docs,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(data: {
    name: string;
    image: Express.Multer.File;
  }): ServiceResponse {
    try {
      const croppedBuffer = await resizeImage(data.image.buffer, 400, 400);
      const { url } = (await uploadtoCloudinary(croppedBuffer)) as {
        url: string;
      };
      await this.categoriesRepository.create({
        name: data.name,
        image: url,
      });
      return {
        success: true,
        message: "created doc successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async edit(
    id: string,
    data: {
      name: string;
      image: Express.Multer.File | undefined;
    }
  ): ServiceResponse {
    try {
      let updation: { name?: string; image?: string } = {};
      const nameExists = await this.categoriesRepository.findOne({
        name: data.name,
        _id: { $ne: id },
      });
      if (nameExists)
        return {
          success: false,
          message: "Name already exists",
          statusCode: 400,
        };
      if (data.name) updation.name = data.name;
      if (data.image) {
        const croppedBuffer = await resizeImage(data.image.buffer, 400, 400);
        const { url } = (await uploadtoCloudinary(croppedBuffer)) as {
          url: string;
        };
        updation.image = url;
      }
      await this.categoriesRepository.findOneAndUpdate({ _id: id }, updation);
      return {
        success: true,
        message: "Created doc successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async delete(id: string, targetCategory: string): ServiceResponse {
    try {
      if (id == targetCategory)
        return {
          success: false,
          message: "Cannot delete category to itself",
          statusCode: 400,
        };
      await this.coursesRepository.updateMany(
        { category: id },
        { category: targetCategory }
      );
      await this.categoriesRepository.deleteOne({ _id: id });
      return {
        success: true,
        message: "Deleted category successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new CategoriesService(
  categoriesRepositoryInstance,
  coursesRepositoryInstance
);
