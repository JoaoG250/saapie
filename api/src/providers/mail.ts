import config from "config";
import sgMail, { MailService } from "@sendgrid/mail";
import Mail from "nodemailer/lib/mailer";
import { IMailProvider, MailMessage } from "../interfaces";

const mailConfig: { userName: string; userAddress: string } =
  config.get("mail");
const sendgridConfig: { apiKey: string } = config.get("sendgrid");

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

export class SendGridMailProvider implements IMailProvider {
  private readonly transporter: MailService;

  constructor() {
    this.transporter = sgMail;
    this.transporter.setApiKey(sendgridConfig.apiKey);
  }

  async sendMail(message: MailMessage): Promise<void> {
    await this.transporter.send({
      to: message.to.address,
      from: `${mailConfig.userName} <${mailConfig.userAddress}>`,
      subject: message.subject,
      html: message.body,
    });
  }
}
