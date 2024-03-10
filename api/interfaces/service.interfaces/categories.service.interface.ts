import ServiceResponse from "../../types/serviceresponse.type.js";
import ICategories from "../categories.interface.js";

export default interface ICategoriesService {
  getAll(): ServiceResponse<{ categories?: ICategories[] }>;

  create(data: { name: string; image: Express.Multer.File }): ServiceResponse;

  edit(
    id: string,
    data: {
      name: string;
      image: Express.Multer.File | undefined;
    }
  ): ServiceResponse;

  delete(id: string, targetCategory: string): ServiceResponse;
}
