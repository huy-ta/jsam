import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import validator from 'validator';

import { ICreateCourseRequest, ICreateCourseRequestErrors } from '../../views/request/ICreateCourseRequest';
import { ApiErrorResponse } from '../../views/response/ApiErrorResponse';
import { HTTPStatus } from '../../enums/HTTPStatusEnum';

const validateCreateCourseRequest = (req: Request, res: Response, next: NextFunction) => {
  const reqBody: ICreateCourseRequest = req.body;

  reqBody.name = reqBody.name ? reqBody.name : '';
  reqBody.subject = reqBody.subject ? reqBody.subject : '';

  let errors: ICreateCourseRequestErrors = {};

  if (validator.isEmpty(reqBody.name)) {
    errors.name = 'Course name is required.';
  }

  if (validator.isEmpty(reqBody.subject)) {
    errors.subject = 'Subject is required.';
  }

  if (!_.isEmpty(errors)) {
    const apiErrorResponse = new ApiErrorResponse(false, 'Request validation failed.', errors);
    res.status(HTTPStatus.BAD_REQUEST).json(apiErrorResponse);
  } else {
    next();
  }
};

export { validateCreateCourseRequest };

export default validateCreateCourseRequest;
