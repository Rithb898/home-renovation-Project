interface IApiResponse {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;
}

class ApiResponse implements IApiResponse {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: any, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode >= 200 && statusCode < 400;
  }
}

export { ApiResponse };
