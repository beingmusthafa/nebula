import IExercises from "../interfaces/exercises.interface.js";
import exercisesRepositoryInstance, {
  ExercisesRepository,
} from "../repositories/exercises.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";

export class ExercisesService {
  private exercisesRepository: ExercisesRepository;
  constructor(exercisesRepository: ExercisesRepository) {
    this.exercisesRepository = exercisesRepository;
  }

  async create(exercise: IExercises): ServiceResponse {
    try {
      console.log({ exercise });
      if (exercise.question.trim().length < 5) {
        return {
          success: false,
          message: "Question must be at least 5 characters",
          statusCode: 400,
        };
      }
      const order = (await this.exercisesRepository.count()) + 1;
      await this.exercisesRepository.create({ ...exercise, order });
      return {
        success: true,
        message: "Exercise created successfully",
        statusCode: 201,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new ExercisesService(exercisesRepositoryInstance);
