import Redis from "ioredis";
import { IJwtRepository } from "../interfaces";

export class JwtRepository implements IJwtRepository {
  constructor(private readonly redis: Redis) {}

  async getRefreshToken(subject: string): Promise<string | null> {
    return this.redis.get(`refreshToken:${subject}`);
  }

  async setRefreshToken(
    subject: string,
    jwid: string,
    expiresIn: number
  ): Promise<true> {
    await this.redis.set(`refreshToken:${subject}`, jwid, "EX", expiresIn);
    return true;
  }

  async deleteRefreshToken(subject: string): Promise<true> {
    await this.redis.del(`refreshToken:${subject}`);
    return true;
  }
}
