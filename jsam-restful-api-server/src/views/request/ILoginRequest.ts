interface ILoginRequest {
  email: string;
  password: string;
}

interface ILoginRequestErrors {
  email?: string;
  password?: string;
}

export { ILoginRequest, ILoginRequestErrors };

export default ILoginRequest;
