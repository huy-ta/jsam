import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import validator from 'validator';

import { ICreateTeachingAssistantRequest, ICreateTeachingAssistantRequestErrors } from '../../views/request/ICreateTeachingAssistantRequest';
import { ApiErrorResponse } from '../../views/response/ApiErrorResponse';
import { HTTPStatus } from '../../enums/HTTPStatusEnum';

const validateCreateTeachingAssistantRequest = (req: Request, res: Response, next: NextFunction) => {
  const reqBody: ICreateTeachingAssistantRequest = req.body;

  reqBody.name = reqBody.name ? reqBody.name : '';

  let errors: ICreateTeachingAssistantRequestErrors = {};

  if (validator.isEmpty(reqBody.name)) {
    errors.name = 'Teaching Assistant name is required.';
  }

  if (!_.isEmpty(errors)) {
    const apiErrorResponse = new ApiErrorResponse(false, 'Request validation failed.', errors);
    res.status(HTTPStatus.BAD_REQUEST).json(apiErrorResponse);
  } else {
    next();
  }
};

export { validateCreateTeachingAssistantRequest };

export default validateCreateTeachingAssistantRequest;
