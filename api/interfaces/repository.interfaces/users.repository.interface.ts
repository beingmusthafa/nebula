import mongoose from "mongoose";
import UsersInterface from "../users.interface.js";
import QueryOptionsInterface from "../queryOptions.interface.js";

export default interface IUsersRepository {
  find(queryFilter: object, options?: QueryOptionsInterface);

  count(query: object);

  findById(
    id: string | mongoose.Types.ObjectId,
    select?: string | Record<string, 1 | 0>
  );

  findByEmail(email: string);

  updateOne(query: object, updation: object);

  create(user: UsersInterface);
}
