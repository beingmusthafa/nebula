import { QueryOptions } from "mongoose";
import CategoriesInterface from "../categories.interface.js";

export default interface ICategoriesRepository {
  find(queryFilter?: object, options?: QueryOptions);

  count(query: object);

  findOne(query: object, options?: QueryOptions);

  findOneAndUpdate(query: object, updation: object);

  deleteOne(query: object);

  create(category: CategoriesInterface);
}
