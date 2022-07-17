import fs from "fs";

export interface IStorageProvider {
  saveFileFromStream(stream: fs.ReadStream, path: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
}
