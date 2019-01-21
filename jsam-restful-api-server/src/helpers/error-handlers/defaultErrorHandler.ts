import { Request, Response, NextFunction } from 'express';
import { ApiErrorResponse } from '../../views/response/ApiErrorResponse';
import { HTTPStatus } from '../../enums/HTTPStatusEnum';

const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const apiErrorResponse = new ApiErrorResponse(false, 'Some unhandled error occured on the backend side.', err);
  return res.status(HTTPStatus.BAD_REQUEST).json(apiErrorResponse);
};

export { defaultErrorHandler };

export default defaultErrorHandler;
