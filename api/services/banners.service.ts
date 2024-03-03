import bannersRepositoryInstance, {
  BannersRepository,
} from "../repositories/banners.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import { resizeImage } from "../utils/cropper.js";
import { uploadtoCloudinary } from "../utils/parser.js";
import { v2 as cloudinary } from "cloudinary";

export class BannersService {
  private bannersRepository: BannersRepository;
  constructor(bannersRepository: BannersRepository) {
    this.bannersRepository = bannersRepository;
  }

  async getBanners(
    forAdmin: boolean = false
  ): ServiceResponse<{ banners: object[] }> {
    try {
      const filter = forAdmin ? {} : { isActive: true };
      const banners = await this.bannersRepository.find(filter);
      return {
        success: true,
        message: "Fetched banners successfully",
        statusCode: 200,
        banners,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addBanner(image: Buffer, link: string): ServiceResponse {
    try {
      if (!image) {
        return {
          success: false,
          message: "Image is required",
          statusCode: 400,
        };
      }
      if (link.length < 10) {
        return {
          success: false,
          message: "Valid link is required",
          statusCode: 400,
        };
      }
      const croppedImage = await resizeImage(image, 1200, 400);
      const { url, public_id } = (await uploadtoCloudinary(croppedImage)) as {
        url: string;
        public_id: string;
      };
      await this.bannersRepository.create({
        image: url,
        imagePublicId: public_id,
        link,
      });
      return {
        success: true,
        message: "Banner added successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async editBanner(bannerId: string, data: { image: Buffer; link: string }) {
    try {
      if (data.link.length < 10) {
        return {
          success: false,
          message: "Valid link is required",
          statusCode: 400,
        };
      }
      let newDoc: any = {};
      if (data.image) {
        const oldDoc = await this.bannersRepository.findOne(bannerId);
        await cloudinary.uploader.destroy(oldDoc.imagePublicId);
        const croppedImage = await resizeImage(data.image, 1200, 400);
        const { url, public_id } = (await uploadtoCloudinary(croppedImage)) as {
          url: string;
          public_id: string;
        };
        newDoc.image = url;
        newDoc.imagePublicId = public_id;
      } else delete data.image;
      newDoc.link = data.link;
      await this.bannersRepository.updateOne(bannerId, newDoc);
      return {
        success: true,
        message: "Banner updated successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteBanner(bannerId: string) {
    try {
      const oldDoc = await this.bannersRepository.findOne(bannerId);
      await cloudinary.uploader.destroy(oldDoc.imagePublicId);
      await this.bannersRepository.deleteOne(bannerId);
      return {
        success: true,
        message: "Banner deleted successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async toggleBanner(bannerId: string, action: "enable" | "disable") {
    try {
      await this.bannersRepository.updateOne(bannerId, {
        isActive: action === "enable",
      });
      return {
        success: true,
        message: "Banner updated successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new BannersService(bannersRepositoryInstance);
