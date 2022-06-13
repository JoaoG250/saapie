import config from "config";
import Redis from "ioredis";

const redisConfig: {
  port: number;
  host: string;
  family: number;
} = config.get("redis");

const redis = new Redis({
  port: redisConfig.port,
  host: redisConfig.host,
  family: redisConfig.family,
});

export default redis;
