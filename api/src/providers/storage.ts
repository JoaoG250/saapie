import fs from "fs";
import path from "path";
import config from "config";
import { IStorageProvider } from "../interfaces/storage";

type FileStorage = typeof fs;
const publicDir: string = config.get("server.publicDir");

export class FsStorageProvider implements IStorageProvider {
  constructor(private readonly fs: FileStorage) {}

  async saveFileFromStream(
    stream: fs.ReadStream,
    filename: string
  ): Promise<string> {
    const filePath = path.join(publicDir, filename);
    if (!this.fs.existsSync(path.dirname(filePath))) {
      this.fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    return new Promise((resolve, reject) => {
      stream
        .pipe(fs.createWriteStream(filePath))
        .on("error", (err) => reject(err))
        .on("finish", () => resolve(filePath));
    });
  }
}
