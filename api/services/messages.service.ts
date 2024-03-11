import messagesRepositoryInstance from "../repositories/messages.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import enrollmentsRepositoryInstance from "../repositories/enrollments.repository.js";
import IMessagesService from "../interfaces/service.interfaces/messages.service.interface.js";
import IMessagesRepository from "../interfaces/repository.interfaces/messages.repository.interface.js";
import IEnrollmentsRepository from "../interfaces/repository.interfaces/enrollments.repository.interface.js";

export class MessagesService implements IMessagesService {
  private messagesRepository: IMessagesRepository;
  private enrollmentsRepository: IEnrollmentsRepository;
  constructor(
    messagesRepository: IMessagesRepository,
    enrollmentsRepository: IEnrollmentsRepository
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
