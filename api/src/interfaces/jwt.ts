import { JwtPayload } from "jsonwebtoken";
import { AuthTokenPayload } from "./auth";

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
  signAcessToken(payload: AuthTokenPayload, subject: string): string;
  signRefreshToken(payload: AuthTokenPayload, subject: string): Promise<string>;
  verifyRefreshToken(token: string): JwtPayload | string;
  validateRefreshToken(token: string): Promise<JwtPayload | false>;
}

export interface IJwtRepository {
  getRefreshToken(subject: string): Promise<string | null>;
  setRefreshToken(
    subject: string,
    jwid: string,
    expiresIn: number
  ): Promise<true>;
  deleteRefreshToken(subject: string): Promise<true>;
}
