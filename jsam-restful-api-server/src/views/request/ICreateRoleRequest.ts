interface ICreateRoleRequest {
  name: string;
  description?: string;
}

interface ICreateRoleRequestErrors {
  name?: string;
  description?: string;
}

export { ICreateRoleRequest, ICreateRoleRequestErrors };

export default ICreateRoleRequest;
