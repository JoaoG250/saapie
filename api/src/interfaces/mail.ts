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
