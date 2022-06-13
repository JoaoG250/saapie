import { JwtPayload } from "jsonwebtoken";

export interface SignJwtArgs {
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
  verifyRefreshToken(token: string): JwtPayload | string;
}

export interface IJwtRepository {
  setRefreshToken(
    subject: string,
    jwid: string,
    expiresIn: number
  ): Promise<true>;
  deleteRefreshToken(subject: string): Promise<true>;
}
