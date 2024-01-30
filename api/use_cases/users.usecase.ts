import UsersInterface from "../interfaces/users.interface.js";
import usersRepositoryInstance, {
  UsersRepository,
} from "../repositories/users.repository.js";

export class UsersUseCase {
  private usersRepository: UsersRepository;
  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  create(user: UsersInterface) {
    try {
      const data = this.usersRepository.create(user);
      return { success: true, data };
    } catch (error) {
      throw error;
    }
  }
}

export default new UsersUseCase(usersRepositoryInstance);
