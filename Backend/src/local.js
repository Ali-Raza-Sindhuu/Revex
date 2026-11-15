// Local development entry only. Vercel uses app.js (export default app).
import dns from "node:dns";
import app from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

const port = Number(process.env.PORT) || 4000;

const reportDatabaseFailure = (error) => {
  console.error(`Could not connect to MongoDB: ${error.message}`);
  console.error("If this is a DNS timeout (queryTxt/querySrv ETIMEOUT), switch your DNS to 8.8.8.8/1.1.1.1, use a hotspot/VPN, or use the non-SRV mongodb:// string.");
  process.exit(1);
};

try {
  await connectDatabase();
} catch (error) {
  const isDnsTimeout = /query(?:Txt|Srv) ETIMEOUT/i.test(error.message);
  if (isDnsTimeout && process.env.NODE_ENV !== "production") {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    try {
      await connectDatabase();
    } catch (retryError) {
      reportDatabaseFailure(retryError);
    }
  } else {
    reportDatabaseFailure(error);
  }
}
const server = app.listen(port, () => console.log(`REVEX API listening on port ${port}`));

const shutdown = async () => {
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
