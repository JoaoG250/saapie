import Redis from "ioredis";
import { IJwtRepository } from "../interfaces";

export class JwtRepository implements IJwtRepository {
  constructor(private readonly redis: Redis) {}

  async setToken(
    prefix: string,
    subject: string,
    jwid: string,
    expiresIn: number
  ): Promise<true> {
    await this.redis.set(`${prefix}:${subject}`, jwid, "EX", expiresIn);
    return true;
  }

  async getToken(prefix: string, subject: string): Promise<string | null> {
    return this.redis.get(`${prefix}:${subject}`);
  }

  async deleteToken(prefix: string, subject: string): Promise<true> {
    await this.redis.del(`${prefix}:${subject}`);
    return true;
  }
}
