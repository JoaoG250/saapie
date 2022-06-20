import redis from "../redis";
import { JwtRepository } from "../repositories/jwt";
import { JwtService } from "./jwtService/jwt.service";

const jwtRepository = new JwtRepository(redis);
export const jwtService = new JwtService(jwtRepository);
