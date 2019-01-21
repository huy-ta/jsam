import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import validator from 'validator';

import {
  ICreateFaultRequest,
  ICreateFaultRequestErrors
} from '../../views/request/ICreateFaultRequest';
import { ApiErrorResponse } from '../../views/response/ApiErrorResponse';
import { HTTPStatus } from '../../enums/HTTPStatusEnum';

const validateCreateFaultRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqBody: ICreateFaultRequest = req.body;

  reqBody.name = reqBody.name ? reqBody.name : '';

  let errors: ICreateFaultRequestErrors = {};

  if (validator.isEmpty(reqBody.name)) {
    errors.name = 'Fault name is required.';
  }

  if (!_.isEmpty(errors)) {
    const apiErrorResponse = new ApiErrorResponse(
      false,
      'Create fault request validation failed.',
      errors
    );
    res.status(HTTPStatus.BAD_REQUEST).json(apiErrorResponse);
  } else {
    next();
  }
};

export { validateCreateFaultRequest };

export default validateCreateFaultRequest;
