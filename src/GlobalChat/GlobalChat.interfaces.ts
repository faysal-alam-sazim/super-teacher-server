import { EUserRole } from "@/common/enums/roles.enum";

export interface ISendMessagePayload {
  id: number;
  message: string;
  attachmentUrl?: string;
  classroomId: number;
  senderId: number;
  firstName: string;
  lastName: string;
  role: EUserRole;
}
