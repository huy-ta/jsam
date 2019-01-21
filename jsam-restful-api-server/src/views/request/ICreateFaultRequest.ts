interface ICreateFaultRequest {
  name: string;
  description?: string;
  fine?: Number;
}

interface ICreateFaultRequestErrors {
  name?: string;
  description?: string;
  fine?: string;
}

export { ICreateFaultRequest, ICreateFaultRequestErrors };

export default ICreateFaultRequest;
