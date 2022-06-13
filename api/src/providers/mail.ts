import config from "config";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { IMailProvider, MailMessage } from "../interfaces";

const mailConfig: { userName: string; userAddress: string } =
  config.get("mail");
const oauthCredentials: {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
} = config.get("oauth");

export class GmailMailProvider implements IMailProvider {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: mailConfig.userAddress,
        clientId: oauthCredentials.clientId,
        clientSecret: oauthCredentials.clientSecret,
        refreshToken: oauthCredentials.refreshToken,
      },
    });
  }

  async sendMail(message: MailMessage): Promise<void> {
    await this.transporter.sendMail({
      from: {
        name: mailConfig.userName,
        address: mailConfig.userAddress,
      },
      to: {
        name: message.to.name,
        address: message.to.address,
      },
      subject: message.subject,
      html: message.body,
    });
  }
}
