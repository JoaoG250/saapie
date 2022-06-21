interface MailAddress {
  name: string;
  address: string;
}

export interface MailMessage {
  to: MailAddress;
  subject: string;
  body: string;
}

export interface IMailProvider {
  sendMail(message: MailMessage): Promise<void>;
}

export interface EmailData {
  protocol: string;
  domain: string;
  title: string;
  to: MailAddress;
  [key: string]: string | object;
}

export type EmailTemplates = "accountActivation" | "passwordReset";

export interface SendMailArgs {
  to: MailAddress;
  subject: string;
  template: EmailTemplates;
  data: object;
}

export interface IMailService {
  sendMail(args: SendMailArgs): Promise<void>;
}
