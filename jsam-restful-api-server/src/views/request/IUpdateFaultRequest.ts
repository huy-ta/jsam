interface IUpdateFaultRequest extends Object {
  name?: string;
  description?: string;
  fine?: Number;
}

interface IUpdateFaultRequestErrors {
  name?: string;
  description?: string;
  fine?: Number;
}

export { IUpdateFaultRequest, IUpdateFaultRequestErrors };

export default IUpdateFaultRequest;
