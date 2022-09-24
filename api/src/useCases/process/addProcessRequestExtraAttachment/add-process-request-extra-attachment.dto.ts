import { FileUpload } from "graphql-upload";

export interface AddProcessRequestExtraAttachmentDto {
  id: string;
  attachment: FileUpload;
}
