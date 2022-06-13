function getEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

export default {
  server: {
    domain: getEnvironmentVariable("DOMAIN"),
    protocol: getEnvironmentVariable("PROTOCOL"),
    port: 4000,
  },
  mail: {
    userName: getEnvironmentVariable("MAIL_USER_NAME"),
    userAddress: getEnvironmentVariable("MAIL_USER_ADDRESS"),
  },
  oauth: {
    clientId: getEnvironmentVariable("OAUTH_CLIENT_ID"),
    clientSecret: getEnvironmentVariable("OAUTH_CLIENT_SECRET"),
    refreshToken: getEnvironmentVariable("OAUTH_REFRESH_TOKEN"),
  },
  jwt: {
    accessTokenSecret: getEnvironmentVariable("JWT_ACCESS_TOKEN_SECRET"),
    accessTokenExpiresIn: 60 * 2,
    refreshTokenSecret: getEnvironmentVariable("JWT_REFRESH_TOKEN_SECRET"),
    refreshTokenExpiresIn: 60 * 60 * 24 * 1,
  },
  redis: {
    port: 6379,
    host: "redis",
    family: 4,
  },
};
