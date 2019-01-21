interface IUpdateRoomRequest {
  name?: string;
  floor?: string;
  capacity?: Number;
}

interface IUpdateRoomRequestErrors {
  name?: string;
  floor?: string;
  capacity?: Number;
}

export { IUpdateRoomRequest, IUpdateRoomRequestErrors };

export default IUpdateRoomRequest;
