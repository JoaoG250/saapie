import { Request } from "express";
import { ExpressContext } from "apollo-server-express";

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
}
