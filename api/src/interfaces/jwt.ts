import { JwtPayload } from "jsonwebtoken";
import { AuthTokenPayload } from "./auth";

export interface SignJwtArgs {
  payload: JwtPayload;
  subject: string;
  secret: string;
  expiresIn: number;
  jwtid?: string;
}

interface TokenConfig {
  secret: string;
  expiresIn: number;
}

export interface TokensConfig {
  accessToken: TokenConfig;
  refreshToken: TokenConfig;
  accountActivationToken: TokenConfig;
}

export type TokenType = keyof Omit<TokensConfig, "accessToken">;

export interface IJwtService {
  signAcessToken(payload: AuthTokenPayload, subject: string): string;
  signToken(
    type: TokenType,
    payload: JwtPayload,
    subject: string
  ): Promise<string>;
  verifyToken(type: TokenType, token: string): string | JwtPayload;
  validateToken(type: TokenType, token: string): Promise<JwtPayload | false>;
}

export interface IJwtRepository {
  setToken(
    prefix: string,
    subject: string,
    jwid: string,
    expiresIn: number
  ): Promise<true>;
  getToken(prefix: string, subject: string): Promise<string | null>;
  deleteToken(prefix: string, subject: string): Promise<true>;
}
