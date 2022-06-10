import config from "config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./schema";

const domain: string = config.get("server.domain");
const protocol: string = config.get("server.protocol");
const port: number = config.get("server.port");

async function startServer() {
  const app = express();

  app.use(
    cors({
      origin: [`${protocol}://${domain}`],
    })
  );

  const apolloServer = new ApolloServer({
    schema,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(port);
  console.log(`🚀 Server ready at ${protocol}://localhost:${port}`);
}

startServer();
