import config from "config";
import cors from "cors";
import morgan from "morgan";
import express, { NextFunction, Request, Response } from "express";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { expressjwt, UnauthorizedError } from "express-jwt";
import { schema } from "./schema";
import { buildContext } from "./context";

const domain: string = config.get("server.domain");
const protocol: string = config.get("server.protocol");
const port: number = config.get("server.port");
const accessTokenSecret: string = config.get("jwt.accessToken.secret");

async function startServer(): Promise<void> {
  const app = express();

  app.use(morgan("dev"));

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
    context: buildContext,
  });

  await apolloServer.start();
  app.use(graphqlUploadExpress());
  apolloServer.applyMiddleware({ app });

  app.listen(port);
  console.log(`🚀 Server ready at ${protocol}://localhost:${port}/graphql`);
}

startServer();
