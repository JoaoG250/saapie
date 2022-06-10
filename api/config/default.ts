function getEnvironmentVariable(name: string) {
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
  jwt: {
    accessTokenSecret: getEnvironmentVariable("JWT_ACCESS_TOKEN_SECRET"),
  },
};
