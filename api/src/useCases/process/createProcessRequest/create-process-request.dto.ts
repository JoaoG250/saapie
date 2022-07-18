import { FileUpload } from "graphql-upload";
import { FormKitData } from "../../../interfaces";

export interface CreateProcessRequestDto {
  processId?: string;
  processSlug?: string;
  userId: string;
  data: FormKitData;
  attachments?: FileUpload[];
}
