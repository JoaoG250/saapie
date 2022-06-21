import config from "config";
import nodemailer from "nodemailer";

const mailConfig: { userName: string; userAddress: string } =
  config.get("mail");
const oauthCredentials: {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
} = config.get("oauth");

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: mailConfig.userAddress,
    clientId: oauthCredentials.clientId,
    clientSecret: oauthCredentials.clientSecret,
    refreshToken: oauthCredentials.refreshToken,
  },
});

export default mailTransporter;
