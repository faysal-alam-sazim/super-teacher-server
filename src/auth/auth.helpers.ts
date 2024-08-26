import { ITokenizedUser } from "@/auth/auth.interfaces";
import { User } from "@/common/entities/users.entity";

export function makeTokenizedUser(user: User): ITokenizedUser {
  return {
    id: user.id,
    claim: user.role,
    email: user.email,
    userProfileId: user.student.id || user.teacher.id,
  };
}
