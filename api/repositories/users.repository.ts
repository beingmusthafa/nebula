import UsersInterface from "../interfaces/users.interface.js";
import usersModel from "../models/users.model.js";

export class UsersRepository {
  async create(user: UsersInterface) {
    try {
      return await usersModel.create(user);
    } catch (error) {
      throw error;
    }
  }
}

export default new UsersRepository();
