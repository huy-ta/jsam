import { ApiResponse } from './ApiResponse';

class ApiErrorResponse extends ApiResponse {
  private errors: object;

  constructor(success: boolean, message: string, errors: object) {
    super(success, message);
    this.errors = errors;
  }
}

export { ApiErrorResponse };

export default ApiErrorResponse;
