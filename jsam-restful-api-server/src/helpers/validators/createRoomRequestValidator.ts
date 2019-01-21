import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import validator from 'validator';

import { ICreateRoomRequest, ICreateRoomRequestErrors } from '../../views/request/ICreateRoomRequest';
import { ApiErrorResponse } from '../../views/response/ApiErrorResponse';
import { HTTPStatus } from '../../enums/HTTPStatusEnum';

const validateCreateRoomRequest = (req: Request, res: Response, next: NextFunction) => {
  const reqBody: ICreateRoomRequest = req.body;

  reqBody.name = reqBody.name ? reqBody.name : '';
  reqBody.floor = reqBody.floor ? reqBody.floor : '';

  let errors: ICreateRoomRequestErrors = {};

  if (validator.isEmpty(reqBody.name)) {
    errors.name = 'Room name is required.';
  }

  if (validator.isEmpty(reqBody.floor)) {
    errors.floor = 'Floor is required.';
  }

  if (!_.isEmpty(errors)) {
    const apiErrorResponse = new ApiErrorResponse(false, 'Request validation failed.', errors);
    res.status(HTTPStatus.BAD_REQUEST).json(apiErrorResponse);
  } else {
    next();
  }
};

export { validateCreateRoomRequest };

export default validateCreateRoomRequest;
