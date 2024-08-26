export interface IJwtPayload {
  sub: number;
  email: string;
}

export interface ITokenizedUser extends Omit<IJwtPayload, "sub"> {
  id: number;
  email: string;
}
