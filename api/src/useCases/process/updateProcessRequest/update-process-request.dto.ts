import { FileUpload } from "graphql-upload";
import { FormKitData } from "../../../interfaces";

export interface UpdateProcessRequestDto {
  id: string;
  data: FormKitData;
  attachments?: FileUpload[];
}
