import { ApiResponse } from './ApiResponse';

class ApiDetailResponse extends ApiResponse {
  private details: object;

  constructor(success: boolean, message: string, details: object) {
    super(success, message);
    this.details = details;
  }
}

export { ApiDetailResponse };

export default ApiDetailResponse;
