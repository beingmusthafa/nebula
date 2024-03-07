import messagesRepositoryInstance, {
  MessagesRepository,
} from "../repositories/messages.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import enrollmentsRepositoryInstance, {
  EnrollmentsRepository,
} from "../repositories/enrollments.repository.js";

export class MessagesService {
  private messagesRepository: MessagesRepository;
  private enrollmentsRepository: EnrollmentsRepository;
  constructor(
    messagesRepository: MessagesRepository,
    enrollmentsRepository: EnrollmentsRepository
  ) {
    this.messagesRepository = messagesRepository;
    this.enrollmentsRepository = enrollmentsRepository;
  }

  async findAll(
    userId: string,
    courseId: string
  ): ServiceResponse<{ messages?: object[] }> {
    try {
      const enrolledInCourse = await this.enrollmentsRepository.findOne({
        user: userId,
        course: courseId,
      });
      if (!enrolledInCourse) {
        return {
          success: false,
          message: "User is not enrolled in the course",
          statusCode: 400,
        };
      }

      const messages = await this.messagesRepository.find(courseId);
      return {
        success: true,
        message: "Messages fetched successfully",
        statusCode: 200,
        messages,
      };
    } catch (error) {
      console.log(error);
    }
  }
}

export default new MessagesService(
  messagesRepositoryInstance,
  enrollmentsRepositoryInstance
);
