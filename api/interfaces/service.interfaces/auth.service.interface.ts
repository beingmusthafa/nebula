import ServiceResponse from "../../types/serviceresponse.type.js";
import UsersInterface from "../users.interface.js";

export default interface IAuthService {
  startSignUp(user: UsersInterface): ServiceResponse;

  finishSignUp(
    user: { name: string; email: string; password: string },
    code: number
  ): ServiceResponse<{ token?: string; doc?: object }>;

  resendCode(email: string, newAccount: boolean): ServiceResponse;

  signIn(credentials: {
    email: string;
    password: string;
  }): ServiceResponse<{ token?: string; doc?: object }>;

  googleAuth(details: {
    email: string;
    name: string;
  }): ServiceResponse<{ token?: string; doc?: object }>;

  sendRecoveryCode(email: string): ServiceResponse;

  verifyCodeAndChangePassword(
    email: string,
    code: number,
    password: string
  ): ServiceResponse<{ token?: string; doc?: object }>;
}
