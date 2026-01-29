import { app } from "./app";
import { env } from "./shared/env";
import { connectDB } from "./shared/db";

async function bootstrap() {
  await connectDB(env.MONGO_URI);

  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${env.PORT}/api/v1`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal startup error:", err);
  process.exit(1);
});
