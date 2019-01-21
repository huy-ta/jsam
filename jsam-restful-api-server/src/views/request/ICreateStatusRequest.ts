interface ICreateStatusRequest {
  name: string;
  description?: string;
}

interface ICreateStatusRequestErrors {
  name?: string;
  description?: string;
}

export { ICreateStatusRequest, ICreateStatusRequestErrors };

export default ICreateStatusRequest;
