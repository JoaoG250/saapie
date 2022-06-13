import cuid from "cuid";
import config from "config";
import jwt from "jsonwebtoken";
import { IJwtRepository, IJwtService, SignJwtArgs } from "../interfaces";

const jwtConfig: {
  accessTokenSecret: string;
  accessTokenExpiresIn: number;
  refreshTokenSecret: string;
  refreshTokenExpiresIn: number;
} = config.get("jwt");

export class JwtService implements IJwtService {
  constructor(private readonly jwtRepository: IJwtRepository) {}

  signJwt({ payload, subject, secret, expiresIn, jwtid }: SignJwtArgs): string {
    const jti = jwtid || cuid();
    return jwt.sign(payload, secret, {
      algorithm: "HS256",
      jwtid: jti,
      subject,
      expiresIn,
    });
  }

  verifyJwt(token: string, secret: string): string | jwt.JwtPayload {
    return jwt.verify(token, secret, {
      algorithms: ["HS256"],
    });
  }

  signAcessToken(payload: jwt.JwtPayload, subject: string): string {
    return this.signJwt({
      payload,
      subject,
      secret: jwtConfig.accessTokenSecret,
      expiresIn: jwtConfig.accessTokenExpiresIn,
    });
  }

  async signRefreshToken(
    payload: jwt.JwtPayload,
    subject: string
  ): Promise<string> {
    const jwtid = cuid();
    const token = this.signJwt({
      payload,
      subject,
      jwtid,
      secret: jwtConfig.refreshTokenSecret,
      expiresIn: jwtConfig.refreshTokenExpiresIn,
    });

    await this.jwtRepository.setRefreshToken(
      subject,
      jwtid,
      jwtConfig.refreshTokenExpiresIn
    );
    return token;
  }

  verifyRefreshToken(token: string): string | jwt.JwtPayload {
    return this.verifyJwt(token, jwtConfig.refreshTokenSecret);
  }
}
