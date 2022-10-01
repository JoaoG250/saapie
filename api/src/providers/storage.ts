import fs from "fs";
import path from "path";
import sharp from "sharp";
import config from "config";
import { IStorageProvider } from "../interfaces/storage";

type FileStorage = typeof fs;
const publicDir: string = config.get("server.publicDir");
const imgMaxDimensions: { width: number; height: number } = config.get(
  "models.processRequestAttachment.imgMaxDimensions"
);

export class FsStorageProvider implements IStorageProvider {
  constructor(private readonly fs: FileStorage) {}

  private async saveImage(
    stream: fs.ReadStream,
    filePath: string,
    resize = imgMaxDimensions
  ): Promise<string> {
    const resizer = await sharp()
      .resize(resize.width, resize.height, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg();
    return new Promise((resolve, reject) => {
      stream
        .pipe(resizer)
        .pipe(fs.createWriteStream(filePath))
        .on("error", (err) => reject(err))
        .on("finish", () => resolve(filePath));
    });
  }

  private async saveFile(
    stream: fs.ReadStream,
    filePath: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      stream
        .pipe(fs.createWriteStream(filePath))
        .on("error", (err) => reject(err))
        .on("finish", () => resolve(filePath));
    });
  }

  async saveFileFromStream(
    stream: fs.ReadStream,
    filename: string,
    mimetype: string
  ): Promise<string> {
    const filePath = path.join(publicDir, filename);
    if (!this.fs.existsSync(path.dirname(filePath))) {
      this.fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    if (mimetype.startsWith("image/")) {
      return this.saveImage(stream, filePath);
    } else {
      return this.saveFile(stream, filePath);
    }
  }

  async deleteFile(filename: string): Promise<void> {
    this.fs.unlinkSync(path.join(publicDir, filename));
  }
}
