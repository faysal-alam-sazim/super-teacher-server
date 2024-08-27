import { EUserRole } from "@/common/enums/roles.enum";

export interface IJwtPayload {
  sub: number;
  email: string;
}

export interface ITokenizedUser extends Omit<IJwtPayload, "sub"> {
  id: number;
  email: string;
  claim: EUserRole;
  firstName: string;
}
