interface IUpdateStatusRequest {
  name: string;
  description?: string;
}

interface IUpdateStatusRequestErrors {
  name?: string;
  description?: string;
}

export { IUpdateStatusRequest, IUpdateStatusRequestErrors };

export default IUpdateStatusRequest;
