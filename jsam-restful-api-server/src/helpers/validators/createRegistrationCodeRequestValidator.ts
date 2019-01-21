import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import validator from 'validator';

import {
  ICreateRegistrationCodeRequest,
  ICreateRegistrationCodeRequestErrors
} from '../../views/request/ICreateRegistrationCodeRequest';
import { ApiErrorResponse } from '../../views/response/ApiErrorResponse';
import { HTTPStatus } from '../../enums/HTTPStatusEnum';
import { UserType } from '../../enums/UserTypeEnum';

const validateCreateRegistrationCodeRequest = (req: Request, res: Response, next: NextFunction) => {
  const reqBody: ICreateRegistrationCodeRequest = req.body;

  reqBody.userType = reqBody.userType ? reqBody.userType : UserType.DEFAULT;

  let errors: ICreateRegistrationCodeRequestErrors = {};

  if (validator.isEmpty(reqBody.userType)) {
    errors.userType = 'User type is required.';
  } else if (!Object.values(UserType).includes(reqBody.userType)) {
    errors.userType = 'User type value is invalid.';
  }

  if (!_.isEmpty(errors)) {
    const apiErrorResponse = new ApiErrorResponse(false, 'Create registration code request validation failed.', errors);
    res.status(HTTPStatus.BAD_REQUEST).json(apiErrorResponse);
  } else {
    next();
  }
};

export { validateCreateRegistrationCodeRequest };

export default validateCreateRegistrationCodeRequest;
