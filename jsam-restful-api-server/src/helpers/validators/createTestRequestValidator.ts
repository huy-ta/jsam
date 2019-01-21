import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import validator from 'validator';

import {
  ICreateTestRequest,
  ICreateTestRequestErrors
} from '../../views/request/ICreateTestRequest';
import { ApiErrorResponse } from '../../views/response/ApiErrorResponse';
import { HTTPStatus } from '../../enums/HTTPStatusEnum';

const validateCreateTestRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqBody: ICreateTestRequest = req.body;

  reqBody.name = reqBody.name ? reqBody.name : '';

  let errors: ICreateTestRequestErrors = {};

  if (validator.isEmpty(reqBody.name)) {
    errors.name = 'Test name is required.';
  }

  if (!_.isEmpty(errors)) {
    const apiErrorResponse = new ApiErrorResponse(
      false,
      'Create test request validation failed.',
      errors
    );
    res.status(HTTPStatus.BAD_REQUEST).json(apiErrorResponse);
  } else {
    next();
  }
};

export { validateCreateTestRequest };

export default validateCreateTestRequest;
