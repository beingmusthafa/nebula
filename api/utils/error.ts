export class CustomError extends Error {
  statusCode: number;
  message: string;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const customError = (
  statusCode: number,
  message: string
): CustomError => {
  return new CustomError(statusCode, message);
};
