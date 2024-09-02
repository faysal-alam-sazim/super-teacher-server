import { SetMetadata } from "@nestjs/common";

import { EUserRole } from "@/common/enums/roles.enum";

export const ROLES_KEY = "roles";
export const Roles = (...roles: EUserRole[]) => SetMetadata(ROLES_KEY, roles);
