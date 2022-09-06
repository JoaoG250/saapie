import { NodeMailerProvider } from "../../providers/mail";
import { MailService } from "./mail.service";
import { mailTransporterMock } from "../../tests/mock/nodemailer";

function buildSUT(): {
  mailService: MailService;
} {
  const mailProvider = new NodeMailerProvider(mailTransporterMock);
  const mailService = new MailService(mailProvider);
  return { mailService };
}

describe("MailService", () => {
  it("should render html templates", async () => {
    const { mailService } = buildSUT();
    const html = await mailService.renderHtmlTemplate("accountActivation", {
      domain: "test.com",
      protocol: "http",
      title: "Testing",
      to: {
        name: "John",
        address: "john@test.com",
      },
      url: "testing",
    });
    expect(html).toBeTruthy();
  });
  it("should send emails", async () => {
    const { mailService } = buildSUT();
    await expect(
      mailService.sendMail({
        to: { name: "John", address: "john@test.com" },
        subject: "Testing",
        template: "accountActivation",
        data: {
          url: "testing",
        },
      })
    ).resolves.toBeUndefined();
  });
});
