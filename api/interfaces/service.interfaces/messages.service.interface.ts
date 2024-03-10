import ServiceResponse from "../../types/serviceresponse.type.js";

export default interface IMessagesService {
  findAll(
    userId: string,
    courseId: string
  ): ServiceResponse<{ messages?: object[] }>;
}
