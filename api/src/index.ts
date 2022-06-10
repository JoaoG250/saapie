import config from "config";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { ApolloServer } from "apollo-server-express";
import { expressjwt, UnauthorizedError } from "express-jwt";
import { GraphQLContext, ExpressJwtContext } from "./types";
import { schema } from "./schema";

const domain: string = config.get("server.domain");
const protocol: string = config.get("server.protocol");
const port: number = config.get("server.port");
const accessTokenSecret: string = config.get("jwt.accessTokenSecret");

async function startServer() {
  const app = express();

  app.use(
    cors({
      origin: [`${protocol}://${domain}`],
    })
  );

  app.use(
    expressjwt({
      secret: accessTokenSecret,
      credentialsRequired: false,
      algorithms: ["HS256"],
    }),
    function (
      err: UnauthorizedError,
      _req: Request,
      _res: Response,
      next: NextFunction
    ) {
      if (err.code === "invalid_token") {
        return next();
      }
      return next(err);
    }
  );

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: ExpressJwtContext): GraphQLContext => {
      return {
        user: req.auth,
      };
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(port);
  console.log(`🚀 Server ready at ${protocol}://localhost:${port}/graphql`);
}

startServer();
