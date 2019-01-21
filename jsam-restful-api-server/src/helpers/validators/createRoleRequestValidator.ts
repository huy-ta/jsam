import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import validator from 'validator';

import { ICreateRoleRequest, ICreateRoleRequestErrors } from '../../views/request/ICreateRoleRequest';
import { ApiErrorResponse } from '../../views/response/ApiErrorResponse';
import { HTTPStatus } from '../../enums/HTTPStatusEnum';

const validateCreateRoleRequest = (req: Request, res: Response, next: NextFunction) => {
  const reqBody: ICreateRoleRequest = req.body;

  reqBody.name = reqBody.name ? reqBody.name : '';

  let errors: ICreateRoleRequestErrors = {};

  if (validator.isEmpty(reqBody.name)) {
    errors.name = 'Role name is required.';
  }

  if (!_.isEmpty(errors)) {
    const apiErrorResponse = new ApiErrorResponse(false, 'Create role request validation failed.', errors);
    res.status(HTTPStatus.BAD_REQUEST).json(apiErrorResponse);
  } else {
    next();
  }
};

export { validateCreateRoleRequest };

export default validateCreateRoleRequest;
