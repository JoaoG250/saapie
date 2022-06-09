import config from "config";
import express from "express";
import cors from "cors";

const domain: string = config.get("server.domain");
const protocol: string = config.get("server.protocol");
const port: number = config.get("server.port");

async function startServer() {
  const app = express();

  // Add CORS middleware
  app.use(
    cors({
      origin: [`${protocol}://${domain}`],
    })
  );

  app.listen(port);
  console.log(`🚀 Server ready at ${protocol}://localhost:${port}`);
}

startServer();
