interface ICreateRoomRequest {
  name?: string;
  floor?: string;
  capacity?: Number;
}

interface ICreateRoomRequestErrors {
  name?: string;
  floor?: string;
  capacity?: Number;
}

export { ICreateRoomRequest, ICreateRoomRequestErrors };

export default ICreateRoomRequest;
