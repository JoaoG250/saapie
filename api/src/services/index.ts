import { jwtRepository } from "../repositories";
import { JwtService } from "./jwtService/jwt.service";

export const jwtService = new JwtService(jwtRepository);
