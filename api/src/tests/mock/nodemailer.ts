import Mail from "nodemailer/lib/mailer";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import mailTransporter from "../../mail";

jest.mock("../../mail", () => ({
  __esModule: true,
  default: mockDeep<Mail>(),
}));

beforeEach(() => {
  mockReset(mailTransporterMock);
});

export const mailTransporterMock =
  mailTransporter as unknown as DeepMockProxy<Mail>;
