import { ProcessRequestStatus } from "@prisma/client";

export interface UpdateProcessRequestStatusDto {
  id: string;
  status: ProcessRequestStatus;
}
