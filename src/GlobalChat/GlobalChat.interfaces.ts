import { EUserRole } from "@/common/enums/roles.enum";

export interface ISendMessagePayload {
  message: string;
  attachmentUrl?: string;
  classroomId: number;
  senderId: number;
  firstName: string;
  lastName: string;
  role: EUserRole;
}
