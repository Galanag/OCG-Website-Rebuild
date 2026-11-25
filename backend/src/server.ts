import "dotenv/config";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { disconnectPrisma } from "./prisma/client.js";

const server = app.listen(env.PORT, () => {
  console.info(`OCG API listening on http://127.0.0.1:${env.PORT} (${env.NODE_ENV})`);
});

async function shutdown(signal: string): Promise<void> {
  console.info(`${signal} received; shutting down.`);
  server.close(async () => {
    await disconnectPrisma();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception", error);
  void shutdown("uncaughtException");
});
