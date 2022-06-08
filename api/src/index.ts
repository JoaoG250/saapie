import express from "express";

async function startServer() {
  const app = express();

  app.listen(4000);
  console.log("🚀 Server ready at http://localhost:4000");
}

startServer();
