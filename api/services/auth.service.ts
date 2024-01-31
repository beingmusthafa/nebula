import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import UsersInterface from "../interfaces/users.interface.js";
import usersRepositoryInstance, {
  UsersRepository,
} from "../repositories/users.repository.js";
import otpsRepositoryInstance, {
  OtpsRepository,
} from "../repositories/otps.repository.js";
import mailerInstance, { Mailer } from "../utils/mailer.js";

export class AuthService {
  private usersRepository: UsersRepository;
  private otpsRepository: OtpsRepository;
  private mailer: Mailer;

  private hashPassword(password: string) {
    return bcryptjs.hashSync(password, 10);
  }
  private comparePassword(password: string, hash: string) {
    return bcryptjs.compareSync(password, hash);
  }
  private generateToken(payload: { id: string }) {
    return jwt.sign(payload, process.env.JWT_SECRET);
  }
  private decodeJWTToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
  constructor(
    usersRepository: UsersRepository,
    otpsRepository: OtpsRepository,
    mailer: Mailer
  ) {
    this.usersRepository = usersRepository;
    this.otpsRepository = otpsRepository;
    this.mailer = mailer;
  }

  async startSignUp(
    user: UsersInterface
  ): Promise<{ success: boolean; message: string; statusCode: number }> {
    try {
      console.log("service");
      console.log(user);
      const nameRegex = /^(?=.{4,20}$)([A-Za-z]+\s?)*[A-Za-z]+$/;
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const passWordRegex =
        /^(?=.*[A-Za-z].*[A-Za-z].*[A-Za-z].*[A-Za-z])(?=.*\d.*\d)[A-Za-z\d]{8,}$/;
      if (!nameRegex.test(user.name)) {
        return {
          success: false,
          message: "Invalid name",
          statusCode: 400,
        };
      }
      if (!emailRegex.test(user.email)) {
        return {
          success: false,
          message: "Invalid email",
          statusCode: 400,
        };
      }
      if (!passWordRegex.test(user.password)) {
        return {
          success: false,
          message: "Password needs >=8 characters (>=4 letters & >=2 numbers)",
          statusCode: 400,
        };
      }
      const userExists = await this.usersRepository.findByEmail(user.email);
      if (userExists)
        return {
          success: false,
          message: "Email already exists",
          statusCode: 400,
        };
      const code = Math.floor(100000 + Math.random() * 900000);
      await this.otpsRepository.create(user.email, code);
      await this.mailer.sendVerificationMail(user.email, code);
      return {
        success: true,
        message: "Verification code sent",
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  async finishSignUp(
    user: UsersInterface,
    code: number
  ): Promise<{
    success: boolean;
    message: string;
    statusCode: number;
    token?: string;
    doc?: object;
  }> {
    try {
      const isCodeCorrect = await this.otpsRepository.findOne(user.email, code);
      if (isCodeCorrect) {
        return {
          success: false,
          message: "Incorrect code",
          statusCode: 400,
        };
      }
      user.password = this.hashPassword(user.password);
      const doc = await this.usersRepository.create(user);
      const token = this.generateToken({ id: doc._id.toString() });
      const { password: _password, ...rest } = doc;
      return {
        success: true,
        message: "User created",
        statusCode: 201,
        token,
        doc: rest,
      };
    } catch (error) {
      throw error;
    }
  }

  async signIn(credentials: { email: string; password: string }): Promise<{
    success: boolean;
    message: string;
    statusCode: number;
    token?: string;
    doc?: object;
  }> {
    try {
      const existingUser = await this.usersRepository.findByEmail(
        credentials.email
      );
      if (!existingUser) {
        return {
          success: false,
          message: "Invalid credentials",
          statusCode: 404,
        };
      }
      const isPasswordCorrect = this.comparePassword(
        credentials.password,
        existingUser.password
      );
      if (!isPasswordCorrect) {
        return {
          success: false,
          message: "Invalid credentials",
          statusCode: 404,
        };
      }
      const { password: _password, ...rest } = existingUser;
      return {
        success: true,
        message: "User logged in",
        statusCode: 200,
        token: this.generateToken({ id: existingUser._id.toString() }),
        doc: rest,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService(
  usersRepositoryInstance,
  otpsRepositoryInstance,
  mailerInstance
);
