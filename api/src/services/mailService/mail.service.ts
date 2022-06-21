import config from "config";
import path from "path";
import ejs from "ejs";
import {
  EmailData,
  EmailTemplates,
  IMailProvider,
  IMailService,
  SendMailArgs,
} from "../../interfaces";

const domain: string = config.get("server.domain");
const protocol: string = config.get("server.protocol");
const mailFolderPath = path.resolve(__dirname, "../../mail");

export class MailService implements IMailService {
  constructor(private readonly mailProvider: IMailProvider) {}

  getTemplatePath(template: EmailTemplates): string {
    return path.join(mailFolderPath, "templates", `${template}.ejs`);
  }

  async renderHtmlTemplate(
    template: EmailTemplates,
    data: EmailData
  ): Promise<string> {
    const templatePath = this.getTemplatePath(template);
    return ejs.renderFile(templatePath, data);
  }

  async sendMail(args: SendMailArgs): Promise<void> {
    const html = await this.renderHtmlTemplate(args.template, {
      protocol,
      domain,
      title: args.subject,
      to: args.to,
      ...args.data,
    });
    return this.mailProvider.sendMail({
      to: args.to,
      subject: args.subject,
      body: html,
    });
  }
}
