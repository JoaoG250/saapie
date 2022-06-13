import { JwtPayload } from "jsonwebtoken";

interface SignJwtArgs {
  payload: JwtPayload;
  subject: string;
  secret: string;
  expiresIn: number;
  jwtid?: string;
}

export interface IJwtService {
  signJwt(args: SignJwtArgs): string;
  verifyJwt(token: string, secret: string): JwtPayload | string;
  signAcessToken(payload: JwtPayload, subject: string): string;
  signRefreshToken(payload: JwtPayload, subject: string): Promise<string>;
  verifyRefreshToken(token: string, secret: string): JwtPayload | string;
}
