import express, { Request, Response, Router, NextFunction } from 'express';

import { validateCreateTestRequest } from '../helpers/validators/createTestRequestValidator';
import { TestModel } from '../models/Test';
import { ICreateTestRequest } from '../views/request/ICreateTestRequest';
import { IUpdateTestRequest } from '../views/request/IUpdateTestRequest';
import { ApiResponse } from '../views/response/ApiResponse';
import { ApiDetailResponse } from '../views/response/ApiDetailResponse';
import { ApiErrorResponse } from '../views/response/ApiErrorResponse';
import { getNullFilteredAndDotifiedObject } from '../helpers/filters/updateObjectFilters';
import { HTTPStatus } from '../enums/HTTPStatusEnum';

class TestController {
  public expressRouter: Router;

  constructor() {
    this.expressRouter = express.Router();
    this.setUpRoutes();
  }

  private setUpRoutes = () => {
    this.expressRouter.get('', this.getAllTests);
    this.expressRouter.get('/:_id', this.getTestById);
    this.expressRouter.post('', validateCreateTestRequest, this.createTest);
    this.expressRouter.put('/:_id', this.updateTestById);
    this.expressRouter.delete('/:_id', this.deleteTestById);
    this.expressRouter.delete('', this.bulkDeleteTestsByIds);

    this.expressRouter.post('/:_id/takers', this.addTestTakers);
    this.expressRouter.put('/:_id/takers', this.updateTestTaker);
    this.expressRouter.delete('/:_id/takers', this.deleteTestTakers);
  };

  private getAllTests = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const tests = await TestModel.find();
      const details = { tests };
      const apiDetailResponse = new ApiDetailResponse(
        true,
        'Successfully got all tests.',
        details
      );
      res.json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private getTestById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { _id } = req.params;
      const test = await TestModel.findOne({ _id });

      if (test) {
        const apiDetailResponse = new ApiDetailResponse(
          true,
          'Successfully got test.',
          test
        );
        res.json(apiDetailResponse);
      } else {
        const errors = {
          _id: `Test not found with id '${_id}'.`
        };
        const apiErrorResponse = new ApiErrorResponse(
          false,
          'Test not found.',
          errors
        );
        res.status(HTTPStatus.BAD_REQUEST).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private createTest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const reqBody: ICreateTestRequest = req.body;

    const { name, totalMarks } = reqBody;

    try {
      const newTest = new TestModel({
        name,
        totalMarks,
        takers: []
      });

      await newTest.save();

      const apiResponse = new ApiResponse(true, 'Successfully created test.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateTestById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { _id } = req.params;

      const reqBody: IUpdateTestRequest = req.body;

      const { name, totalMarks } = reqBody;

      let fieldsToBeUpdated: IUpdateTestRequest = getNullFilteredAndDotifiedObject(
        {
          name,
          totalMarks
        }
      );

      const foundTest = await TestModel.findOne({ _id });
      await foundTest.update(fieldsToBeUpdated);

      const apiResponse = new ApiResponse(true, 'Updated test successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private deleteTestById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { _id } = req.params;

      await TestModel.findOneAndDelete({ _id });

      const apiResponse = new ApiResponse(true, 'Deleted test successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private bulkDeleteTestsByIds = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const reqQueryIds = req.query._id;
      let _ids;
      if (typeof reqQueryIds === 'string') {
        _ids = [req.query._id];
      } else {
        _ids = [...reqQueryIds];
      }

      const response = await TestModel.deleteMany({ _id: { $in: _ids } });
      if (response.n > 0) {
        const apiResponse = new ApiResponse(
          true,
          'Bulk deleted tests successfully.'
        );
        res.json(apiResponse);
      } else {
        const errors = {
          _ids: 'Some of the tests were not found.'
        };
        const apiErrorResponse = new ApiErrorResponse(
          true,
          "Couldn't delete tests.",
          errors
        );
        res.status(HTTPStatus.BAD_REQUEST).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private addTestTakers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { _id } = req.params;

    const reqBody = req.body;

    const { studentId, mark, date } = reqBody;

    try {
      const foundTest = await TestModel.findOne({ _id });

      let isThereDuplicatedStudent = false;
      if (
        foundTest.takers.find(
          foundStudent => foundStudent.studentId === studentId
        )
      ) {
        isThereDuplicatedStudent = true;
        const errors = {
          students: `Duplicated studentId: ${studentId}.`
        };
        const apiErrorResponse = new ApiErrorResponse(
          false,
          "Couldn't add students to study phase.",
          errors
        );
        return res.status(HTTPStatus.BAD_REQUEST).json(apiErrorResponse);
      }

      if (!isThereDuplicatedStudent) {
        const newTaker = { studentId, mark, date };
        foundTest.takers = [...foundTest.takers, newTaker];

        // await denormNewlyAddedStudents(foundTest, takers.length);

        await foundTest.save();

        const apiResponse = new ApiResponse(
          true,
          'Added student(s) to test successfully.'
        );
        res.json(apiResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private deleteTestTakers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { _id } = req.params;

    const reqBody = req.body;

    const { studentId } = reqBody;

    try {
      const foundTest = await TestModel.findOne({ _id });

      // foundTest.takers.forEach(taker => {
      foundTest.takers = foundTest.takers.filter(
        foundStudent => foundStudent.studentId !== studentId
      );
      // });

      await foundTest.save();

      const apiResponse = new ApiResponse(
        true,
        'Deleted student(s) from test successfully.'
      );
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateTestTaker = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { _id } = req.params;

    const reqBody = req.body;

    const { studentId, mark, date } = reqBody;

    try {
      const foundTest = await TestModel.findOne({ _id });

      const updatedTaker = { studentId, mark, date };
      foundTest.takers = foundTest.takers.map(taker => {
        if (taker.studentId === studentId) {
          return updatedTaker;
        }
      });
      // foundTest.takers = reqBody;

      // await denormTestStudents(foundTest);

      foundTest.markModified('takers');

      await foundTest.save();

      const apiResponse = new ApiResponse(
        true,
        "Updated test's takers successfully."
      );
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };
}

const TestControllerRouter = new TestController().expressRouter;

export { TestControllerRouter as TestController };

export default TestControllerRouter;
