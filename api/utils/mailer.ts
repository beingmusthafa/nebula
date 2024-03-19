import nodemailer from "nodemailer";

const config = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASS,
  },
};
const transporter = nodemailer.createTransport(config);

export class Mailer {
  private transporter: any;
  constructor(transporter: any) {
    this.transporter = transporter;
  }
  async sendRecoveryMail(email: string, code: number) {
    const mail = {
      from: process.env.GMAIL,
      to: email,
      subject: "Password recovery of Nebula Account",
      text: `Hello,\nYou have requested a password recovery for your account with the email '${email}'. Your recovery code is ${code}.THIS CODE IS ONLY VALID FOR 3 MINUTES! Dont worry, kindly ignore this mail if you didnt initiate this request. Happy learning.\n Team Nebula`,
    };
    await this.transporter.sendMail(mail, (err) => {
      if (err) {
        throw err;
      }
    });
  }

  async sendVerificationMail(email: string, code: number) {
    const mail = {
      from: process.env.GMAIL,
      to: email,
      subject: "Signup verification for Nebula Account",
      text: `Hello,\nYour verification code to register the email '${email}' is ${code}. Dont worry, kindly ignore this mail if you didnt initiate this request. Happy learning.\n Team Nebula`,
    };
    await this.transporter.sendMail(mail, (err) => {
      if (err) {
        throw err;
      }
    });
  }
}

export default new Mailer(transporter);
