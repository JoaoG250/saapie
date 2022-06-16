import { Request } from "express";
import { ExpressContext } from "apollo-server-express";
import {
  IAuthService,
  IGroupRepository,
  IGroupService,
  IUserRepository,
} from "../interfaces";

interface UserFromRequest {
  id: string;
}

interface JwtRequest extends Request {
  auth?: UserFromRequest | undefined;
}

interface ExpressJwtContext extends ExpressContext {
  req: JwtRequest;
}

interface GraphQLContext {
  user?: UserFromRequest;
  userRepository: IUserRepository;
  groupRepository: IGroupRepository;
  authService: IAuthService;
  groupService: IGroupService;
}
