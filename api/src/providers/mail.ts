import config from "config";
import Mail from "nodemailer/lib/mailer";
import { IMailProvider, MailMessage } from "../interfaces";

const mailConfig: { userName: string; userAddress: string } =
  config.get("mail");

export class GmailMailProvider implements IMailProvider {
  constructor(private readonly transporter: Mail) {}

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
