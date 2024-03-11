import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import UsersInterface from "../interfaces/users.interface.js";
import usersRepositoryInstance from "../repositories/users.repository.js";
import otpsRepositoryInstance from "../repositories/otps.repository.js";
import mailerInstance, { Mailer } from "../utils/mailer.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import IAuthService from "../interfaces/service.interfaces/auth.service.interface.js";
import IUsersRepository from "../interfaces/repository.interfaces/users.repository.interface.js";
import IOtpsRepository from "../interfaces/repository.interfaces/otps.repository.interface.js";

export class AuthService implements IAuthService {
  private usersRepository: IUsersRepository;
  private otpsRepository: IOtpsRepository;
  private mailer: Mailer;

  private hashPassword(password: string) {
    const salt = bcryptjs.genSaltSync(10);
    return bcryptjs.hashSync(password, salt);
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
    usersRepository: IUsersRepository,
    otpsRepository: IOtpsRepository,
    mailer: Mailer
  ) {
    this.usersRepository = usersRepository;
    this.otpsRepository = otpsRepository;
    this.mailer = mailer;
  }

  async startSignUp(user: UsersInterface): ServiceResponse {
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
      console.log(error);
      throw error;
    }
  }

  async finishSignUp(
    user: { name: string; email: string; password: string },
    code: number
  ): ServiceResponse<{ token?: string; doc?: object }> {
    try {
      const isCodeCorrect = await this.otpsRepository.findOne({
        email: user.email,
        code,
      });
      if (!isCodeCorrect) {
        return {
          success: false,
          message: "Incorrect code",
          statusCode: 400,
        };
      }
      user.password = this.hashPassword(user.password);
      const doc = await this.usersRepository.create({
        ...user,
        isAuthExternal: false,
      });
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
      console.log(error);
      throw error;
    }
  }

  async resendCode(email: string, newAccount: boolean): ServiceResponse {
    try {
      const userExists = await this.usersRepository.findByEmail(email);
      if (userExists && newAccount) {
        return {
          success: false,
          message: "Email already exists",
          statusCode: 400,
        };
      }
      if (!userExists && !newAccount) {
        return {
          success: false,
          message: "No user found",
          statusCode: 404,
        };
      }
      const code = Math.floor(100000 + Math.random() * 900000);
      await this.otpsRepository.create(email, code);
      await this.mailer.sendVerificationMail(email, code);
      return {
        success: true,
        message: "Verification code resent",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async signIn(credentials: {
    email: string;
    password: string;
  }): ServiceResponse<{ token?: string; doc?: object }> {
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
      console.log(error);
      throw error;
    }
  }

  async googleAuth(details: {
    email: string;
    name: string;
  }): ServiceResponse<{ token?: string; doc?: object }> {
    try {
      console.log("details", details);
      const existingUser = await this.usersRepository.findByEmail(
        details.email
      );
      if (existingUser) {
        const { password: _password, ...rest } = existingUser;
        console.log(rest);
        return {
          success: true,
          message: "User logged in",
          statusCode: 200,
          token: this.generateToken({ id: existingUser._id.toString() }),
          doc: rest,
        };
      }
      const generatedPassword = Math.random().toString(36).slice(-8);
      const password = this.hashPassword(generatedPassword);
      const doc = await this.usersRepository.create({
        password,
        email: details.email,
        name: details.name,
        isAuthExternal: true,
      });
      const { password: _password, ...rest } = doc;
      return {
        success: true,
        message: "User created",
        statusCode: 201,
        token: this.generateToken({ id: doc._id.toString() }),
        doc: rest,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async sendRecoveryCode(email: string): ServiceResponse {
    try {
      const user = await this.usersRepository.findByEmail(email);
      if (!user) {
        return {
          success: false,
          message: "User not found",
          statusCode: 404,
        };
      }
      const code = Math.floor(100000 + Math.random() * 900000);
      await this.otpsRepository.create(email, code);
      await this.mailer.sendRecoveryMail(email, code);
      return {
        success: true,
        message: "Recovery code sent",
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verifyCodeAndChangePassword(
    email: string,
    code: number,
    password: string
  ): ServiceResponse<{ token?: string; doc?: object }> {
    try {
      const isCodeCorrect = await this.otpsRepository.findOne({ email, code });
      if (!isCodeCorrect) {
        return {
          success: false,
          message: "Incorrect code",
          statusCode: 400,
        };
      }
      const passWordRegex =
        /^(?=.*[A-Za-z].*[A-Za-z].*[A-Za-z].*[A-Za-z])(?=.*\d.*\d)[A-Za-z\d]{8,}$/;
      if (!passWordRegex.test(password)) {
        return {
          success: false,
          message: "Password needs >=8 characters (>=4 letters & >=2 numbers)",
          statusCode: 400,
        };
      }
      const hashedPassword = this.hashPassword(password);
      const user = await this.usersRepository.updateOne(
        { email },
        { password: hashedPassword }
      );
      const { password: _password, ...doc } = user;
      const token = this.generateToken({ id: user._id.toString() });
      console.log(doc);
      return {
        success: true,
        message: "Password changed",
        statusCode: 200,
        token,
        doc,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new AuthService(
  usersRepositoryInstance,
  otpsRepositoryInstance,
  mailerInstance
);
