import IChapters from "../interfaces/chapters.interface.js";
import chaptersRepositoryInstance, {
  ChaptersRepository,
} from "../repositories/chapters.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";

export class ChaptersService {
  private chaptersRepository: ChaptersRepository;
  constructor(chaptersRepository: ChaptersRepository) {
    this.chaptersRepository = chaptersRepository;
  }

  async create(chapter: IChapters): ServiceResponse {
    try {
      if (chapter.title.trim().length < 5) {
        return {
          success: false,
          message: "Title must be at least 5 characters",
          statusCode: 400,
        };
      }
      if (chapter.title.trim().length > 100) {
        return {
          success: false,
          message: "Title must be at most 100 characters",
          statusCode: 400,
        };
      }
      const nameExists = await this.chaptersRepository.findOne({
        title: chapter.title,
      });
      if (nameExists)
        return {
          success: false,
          message: "Chapter already exists",
          statusCode: 400,
        };
      const order = (await this.chaptersRepository.count()) + 1;
      await this.chaptersRepository.create({ ...chapter, order });
      return {
        success: true,
        message: "Chapter created successfully",
        statusCode: 201,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new ChaptersService(chaptersRepositoryInstance);
