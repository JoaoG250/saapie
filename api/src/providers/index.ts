import fs from "fs";
import { SendGridMailProvider } from "./mail";
import { FsStorageProvider } from "./storage";

export const mailProvider = new SendGridMailProvider();
export const storageProvider = new FsStorageProvider(fs);
