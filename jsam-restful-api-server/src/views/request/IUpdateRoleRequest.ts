interface IUpdateRoleRequest {
  name: string;
  description?: string;
}

interface IUpdateRoleRequestErrors {
  name?: string;
  description?: string;
}

export { IUpdateRoleRequest, IUpdateRoleRequestErrors };

export default IUpdateRoleRequest;
