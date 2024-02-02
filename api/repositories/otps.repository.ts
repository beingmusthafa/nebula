import otpsModel from "../models/otps.model.js";

export class OtpsRepository {
  private model = otpsModel;
  private async delete(email: string) {
    await this.model.deleteOne({ email });
  }

  async findOne(query: { email: string; code?: number }) {
    return await this.model.findOne(query);
  }

  async create(email: string, code: number) {
    const otpExists = await this.findOne({ email });
    if (otpExists) await this.delete(email);
    await this.model.create({ email, code });
    setTimeout(async () => {
      await this.delete(email);
    }, 1000 * 60 * 3);
  }
}

export default new OtpsRepository();
