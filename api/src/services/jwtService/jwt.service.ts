import cuid from "cuid";
import config from "config";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  IJwtRepository,
  IJwtService,
  SignJwtArgs,
  TokensConfig,
  TokenType,
} from "../../interfaces";

const jwtConfig: TokensConfig = config.get("jwt");

export class JwtService implements IJwtService {
  constructor(private readonly jwtRepository: IJwtRepository) {}

  private signJwt({
    payload,
    subject,
    secret,
    expiresIn,
    jwtid,
  }: SignJwtArgs): string {
    const jti = jwtid || cuid();
    return jwt.sign(payload, secret, {
      algorithm: "HS256",
      jwtid: jti,
      subject,
      expiresIn,
    });
  }

  private verifyJwt(token: string, secret: string): string | JwtPayload {
    return jwt.verify(token, secret, {
      algorithms: ["HS256"],
    });
  }

  signAcessToken(payload: JwtPayload, subject: string): string {
    return this.signJwt({
      payload,
      subject,
      secret: jwtConfig.accessToken.secret,
      expiresIn: jwtConfig.accessToken.expiresIn,
    });
  }

  async signToken(
    type: TokenType,
    payload: JwtPayload,
    subject: string
  ): Promise<string> {
    const jwtid = cuid();
    const token = this.signJwt({
      payload,
      subject,
      jwtid,
      secret: jwtConfig[type].secret,
      expiresIn: jwtConfig[type].expiresIn,
    });

    await this.jwtRepository.setToken(
      type,
      subject,
      jwtid,
      jwtConfig[type].expiresIn
    );
    return token;
  }

  verifyToken(type: TokenType, token: string): string | JwtPayload {
    return this.verifyJwt(token, jwtConfig[type].secret);
  }

  async validateToken(
    type: TokenType,
    token: string
  ): Promise<JwtPayload | false> {
    const payload = this.verifyToken(type, token);
    if (typeof payload === "string" || !payload.jti || !payload.sub) {
      return false;
    }

    const storedValue = await this.jwtRepository.getToken(type, payload.sub);
    if (storedValue === null || storedValue !== payload.jti) {
      return false;
    }

    await this.jwtRepository.deleteToken(type, payload.sub);
    return payload;
  }
}
