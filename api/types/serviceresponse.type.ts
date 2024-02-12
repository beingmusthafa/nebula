type ServiceResponse<T = {}> = Promise<
  {
    success: boolean;
    message: string;
    statusCode: number;
  } & T
>;

export default ServiceResponse;
