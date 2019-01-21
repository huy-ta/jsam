import express, { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import { UserModel } from '../models/User';
import { UserType } from '../enums/UserTypeEnum';
import { validateLoginRequest } from '../helpers/validators/loginRequestValidator';
import { keys } from '../config/keys';
import { ILoginRequest } from '../views/request/ILoginRequest';
import { ApiDetailResponse } from '../views/response/ApiDetailResponse';
import { ApiErrorResponse } from '../views/response/ApiErrorResponse';
import { HTTPStatus } from '../enums/HTTPStatusEnum';
import { TeachingAssistantModel } from '../models/TeachingAssistant';
import { TeacherModel } from '../models/Teacher';
import { RegistrationCodeModel } from '../models/RegistrationCode';
import { ApiResponse } from '../views/response/ApiResponse';

class AuthController {
  public expressRouter: Router;

  constructor() {
    this.expressRouter = express.Router();
    this.setUpRoutes();
  }

  private setUpRoutes = () => {
    this.expressRouter.post('/login', validateLoginRequest, this.loginUser);
    this.expressRouter.post('/register', this.registerUser);
    this.expressRouter.get('/current', passport.authenticate('jwt', { session: false }), this.getCurrentUser);
  };

  private loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: ILoginRequest = req.body;

    const { email, password } = reqBody;

    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        const errors = {
          email: 'Email not found.'
        };
        const apiErrorResponse = new ApiErrorResponse(false, 'User not found.', errors);
        return res.status(HTTPStatus.NOT_FOUND).send(apiErrorResponse);
      }

      const doesPasswordMatch = await bcrypt.compare(password, user.password);

      if (doesPasswordMatch) {
        const { _id, userType } = user;
        let name = '';

        if (userType === UserType.TEACHING_ASSISTANT) {
          const teachingAssistant = await TeachingAssistantModel.findOne({ email });
          name = teachingAssistant.name;
        } else if (userType === UserType.TEACHER || userType === UserType.CENTER_OWNER) {
          const teacher = await TeacherModel.findOne({ email });
          name = teacher.name;
        }

        const jwtPayload = {
          _id,
          email,
          name,
          userType
        };

        const authToken = await jwt.sign(jwtPayload, keys.secretOrKey, { expiresIn: 3600 });

        const details = {
          authToken: `Bearer ${authToken}`
        };
        const apiDetailResponse = new ApiDetailResponse(true, 'Successfully logged in.', details);
        res.json(apiDetailResponse);
      } else {
        const errors = {
          password: 'Password incorrect.'
        };
        const apiErrorResponse = new ApiErrorResponse(false, 'Login request failed.', errors);
        return res.status(HTTPStatus.BAD_REQUEST).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, code } = req.body;
      const registrationCode = await RegistrationCodeModel.findOne({ code });
      let userType;
      if (registrationCode) {
        userType = registrationCode.userType;

        if (userType === UserType.TEACHING_ASSISTANT) {
          const teachingAssistant = await TeachingAssistantModel.findOne({ email });
          if (!teachingAssistant) {
            const errors = {
              email: 'Email does not belong to any employee. Please contact the center owner!'
            };
            const apiErrorResponse = new ApiErrorResponse(false, 'Register request failed.', errors);
            return res.status(HTTPStatus.BAD_REQUEST).send(apiErrorResponse);
          }
        }
        if (userType === UserType.TEACHER || userType === UserType.CENTER_OWNER) {
          const teacher = await TeacherModel.findOne({ email });
          if (!teacher) {
            const errors = {
              email: 'Email does not belong to any employee. Please contact the center owner!'
            };
            const apiErrorResponse = new ApiErrorResponse(false, 'Register request failed.', errors);
            return res.status(HTTPStatus.BAD_REQUEST).send(apiErrorResponse);
          }
        }

        const foundUser = await UserModel.findOne({ email: req.body.email });
        if (foundUser) {
          const errors = {
            email: 'Email is already taken.'
          };
          const apiErrorResponse = new ApiErrorResponse(false, 'Register request failed.', errors);
          return res.status(HTTPStatus.BAD_REQUEST).send(apiErrorResponse);
        }

        const newUser = new UserModel({
          email,
          password,
          userType
        });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.password, salt);

        newUser.password = hash;

        await newUser.save();
        const apiResponse = new ApiResponse(true, 'Successfully register.');
        res.json(apiResponse);
      } else {
        const errors = {
          code: 'Invalid registration code.'
        };
        const apiErrorResponse = new ApiErrorResponse(false, 'Register request failed.', errors);
        return res.status(HTTPStatus.BAD_REQUEST).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    res.json({
      id: req.user.id,
      email: req.user.email,
      userType: req.user.userType
    });
  };
}

const AuthControllerRouter = new AuthController().expressRouter;

export { AuthControllerRouter as AuthController };

export default AuthControllerRouter;
