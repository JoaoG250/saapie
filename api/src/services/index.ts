import { mailProvider } from "../providers";
import { jwtRepository } from "../repositories";
import { JwtService } from "./jwtService/jwt.service";
import { MailService } from "./mailService/mail.service";

export const jwtService = new JwtService(jwtRepository);
export const mailService = new MailService(mailProvider);
