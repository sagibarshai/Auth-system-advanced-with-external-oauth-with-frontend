import { Pool } from "pg";
import { createUsersTableIfNotExists } from "./tables/users";
import { config } from "../config";
import { CreateEmailVerificationsTableIfNotExists } from "./tables/email-verification";

export const pgClient = new Pool({
  user: config.POSTGRES.USER,
  password: config.POSTGRES.PASSWORD,
  database: config.POSTGRES.DATABASE,
  port: config.POSTGRES.PORT,
  host: config.POSTGRES.HOST,
  ssl: config.POSTGRES.SSL,
});
pgClient.on("connect", async () => {
  await createUsersTableIfNotExists();
  await CreateEmailVerificationsTableIfNotExists();
});
