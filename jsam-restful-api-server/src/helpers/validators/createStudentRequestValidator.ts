import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import validator from 'validator';

import { ICreateStudentRequest, ICreateStudentRequestErrors } from '../../views/request/ICreateStudentRequest';
import { ApiErrorResponse } from '../../views/response/ApiErrorResponse';
import { HTTPStatus } from '../../enums/HTTPStatusEnum';
import { Gender } from '../../enums/GenderEnum';

const validateCreateStudentRequest = (req: Request, res: Response, next: NextFunction) => {
  const reqBody: ICreateStudentRequest = req.body;

  reqBody.name = reqBody.name ? reqBody.name : '';

  let errors: ICreateStudentRequestErrors = {};

  if (validator.isEmpty(reqBody.name)) {
    errors.name = 'Student name is required.';
  }

  if (!Object.values(Gender).includes(reqBody.gender)) {
    errors.gender = 'Gender value must not be empty.';
  }

  if (!_.isEmpty(errors)) {
    const apiErrorResponse = new ApiErrorResponse(false, 'Create student request validation failed.', errors);
    res.status(HTTPStatus.BAD_REQUEST).json(apiErrorResponse);
  } else {
    next();
  }
};

export { validateCreateStudentRequest };

export default validateCreateStudentRequest;
