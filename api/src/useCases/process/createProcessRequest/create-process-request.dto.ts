import { FileUpload } from "graphql-upload";
import { JsonValue } from "../../../interfaces";

export interface CreateProcessRequestDto {
  processId?: string;
  processSlug?: string;
  userId: string;
  data: JsonValue;
  attachments?: FileUpload[];
}
