import _ from 'lodash';
import validator from 'validator';
import { Request, Response, NextFunction } from 'express';

import { HTTPStatus } from '../../enums/HTTPStatusEnum';
import { ApiErrorResponse } from '../../views/response/ApiErrorResponse';
import { ILoginRequest, ILoginRequestErrors } from '../../views/request/ILoginRequest';

// FIXME: optimize require lodash;
const validateLoginRequest = (req: Request, res: Response, next: NextFunction) => {
  const reqBody: ILoginRequest = req.body;

  let errors: ILoginRequestErrors = {};

  reqBody.email = !_.isEmpty(reqBody.email) ? reqBody.email : '';
  reqBody.password = !_.isEmpty(reqBody.password) ? reqBody.password : '';

  if (validator.isEmpty(reqBody.email)) {
    errors.email = 'Email is required.';
  } else if (!validator.isEmail(reqBody.email)) {
    errors.email = 'Email is incorrectly formatted.';
  }

  if (validator.isEmpty(reqBody.password)) {
    errors.password = 'Password is required.';
  }

  if (!_.isEmpty(errors)) {
    const apiErrorResponse = new ApiErrorResponse(false, 'Login request validation failed.', errors);
    res.status(HTTPStatus.BAD_REQUEST).json(apiErrorResponse);
  } else {
    next();
  }
};

export { validateLoginRequest };

export default validateLoginRequest;
