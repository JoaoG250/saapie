import path from "path";

function getEnvironmentVariable(name: string, fallback?: string): string {
  const value = process.env[name];
  if (!value) {
    if (fallback) {
      return fallback;
    }
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

const accessTokenSecret = getEnvironmentVariable("JWT_ACCESS_TOKEN_SECRET");
const refreshTokenSecret = getEnvironmentVariable("JWT_REFRESH_TOKEN_SECRET");
const rootDir = path.resolve(__dirname, "../");
const publicUrl = "public/";
const publicDir = path.join(rootDir, publicUrl);

export default {
  server: {
    domain: getEnvironmentVariable("DOMAIN"),
    protocol: getEnvironmentVariable("PROTOCOL"),
    port: 4000,
    loggingFormat: "dev",
    rootDir,
    baseUrl: getEnvironmentVariable("BASE_URL", "/"),
    publicUrl,
    publicDir,
  },
  mail: {
    userName: getEnvironmentVariable("MAIL_USER_NAME"),
    userAddress: getEnvironmentVariable("MAIL_USER_ADDRESS"),
  },
  sendgrid: {
    apiKey: getEnvironmentVariable("SENDGRID_API_KEY"),
  },
  jwt: {
    accessToken: {
      secret: accessTokenSecret,
      expiresIn: 60 * 5,
    },
    refreshToken: {
      secret: refreshTokenSecret,
      expiresIn: 60 * 60 * 24 * 1,
    },
    accountActivationToken: {
      secret: accessTokenSecret,
      expiresIn: 60 * 60 * 24 * 5,
    },
    resetPasswordToken: {
      secret: accessTokenSecret,
      expiresIn: 60 * 60 * 24 * 1,
    },
  },
  redis: {
    port: 6379,
    host: "redis",
    family: 4,
  },
  models: {
    processRequestAttachment: {
      imgMaxDimensions: {
        width: 1920,
        height: 1080,
      },
    },
  },
};
