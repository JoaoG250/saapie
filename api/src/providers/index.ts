import mailTransporter from "../mail";
import { GmailMailProvider } from "./mail";

export const mailProvider = new GmailMailProvider(mailTransporter);
