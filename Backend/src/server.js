import app from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

const port = Number(process.env.PORT) || 4000;

await connectDatabase();
const server = app.listen(port, () => console.log(`REVEX API listening on port ${port}`));

const shutdown = async () => {
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
