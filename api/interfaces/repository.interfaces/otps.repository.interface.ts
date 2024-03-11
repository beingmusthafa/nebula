export default interface IOtpsRepository {
  findOne(query: { email: string; code?: number });

  create(email: string, code: number);
}
