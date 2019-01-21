import express, { Request, Response, Router, NextFunction } from 'express';

import { validateCreateRoomRequest } from '../helpers/validators/createRoomRequestValidator';
import { RoomModel } from '../models/Room';
import { ICreateRoomRequest } from '../views/request/ICreateRoomRequest';
import { IUpdateRoomRequest } from '../views/request/IUpdateRoomReques';
import { ApiResponse } from '../views/response/ApiResponse';
import { ApiDetailResponse } from '../views/response/ApiDetailResponse';
import { ApiErrorResponse } from '../views/response/ApiErrorResponse';
import { getNullFilteredAndDotifiedObject } from '../helpers/filters/updateObjectFilters';

class RoomController {
  public expressRouter: Router;

  constructor() {
    this.expressRouter = express.Router();
    this.setUpRoutes();
  }

  private setUpRoutes = () => {
    this.expressRouter.get('', this.getAllRooms);
    this.expressRouter.get('/:_id', this.getRoomById);
    this.expressRouter.post('', validateCreateRoomRequest, this.createRoom);
    this.expressRouter.put('/:_id', this.updateRoomById);
    this.expressRouter.delete('/:_id', this.deleteRoomById);
  };

  private getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rooms = await RoomModel.find();
      const details = { rooms };
      const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got all rooms.', details);
      res.json(apiDetailResponse);
    } catch (err) {
      next(err);
    }
  };

  private getRoomById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;
      const room = await RoomModel.findOne({ _id });

      if (room) {
        const apiDetailResponse = new ApiDetailResponse(true, 'Successfully got room.', room);
        res.json(apiDetailResponse);
      } else {
        const errors = {
          _id: `Room not found with id '${_id}'.`
        };
        const apiErrorResponse = new ApiErrorResponse(false, 'Room not found.', errors);
        res.status(404).send(apiErrorResponse);
      }
    } catch (err) {
      next(err);
    }
  };

  private createRoom = async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: ICreateRoomRequest = req.body;

    const { name, floor, capacity } = reqBody;

    try {
      const newRoom = new RoomModel({
        name,
        floor,
        capacity
      });

      await newRoom.save();

      const apiResponse = new ApiResponse(true, 'Successfully created room.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private updateRoomById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      const reqBody: IUpdateRoomRequest = req.body;

      const { name, floor, capacity } = reqBody;

      let fieldsToBeUpdated: IUpdateRoomRequest = getNullFilteredAndDotifiedObject({
        name,
        floor,
        capacity
      });

      await RoomModel.findOneAndUpdate({ _id }, fieldsToBeUpdated);

      const apiResponse = new ApiResponse(true, 'Updated room successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };

  private deleteRoomById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      await RoomModel.findOneAndDelete({ _id });

      const apiResponse = new ApiResponse(true, 'Deleted room successfully.');
      res.json(apiResponse);
    } catch (err) {
      next(err);
    }
  };
}

const RoomControllerRouter = new RoomController().expressRouter;

export { RoomControllerRouter as RoomController };

export default RoomControllerRouter;
