import { pgClient } from "../init";

export const CreateEmailVerificationsTableIfNotExists = async () => {
  try {
    await pgClient.query(`
                    CREATE TABLE IF NOT EXISTS Email_Verifications
                    (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) CHECK(LENGTH(email) > 6) UNIQUE NOT NULL,
                    user_id INT REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
                    is_sent BOOLEAN NOT NULL, 
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    attempts INT NOT NULL DEFAULT 0
                    ); 
                    `);
    console.log(`Email_Verifications table is ready!`);
  } catch (err) {
    console.log("Cannot Create table Email_Verifications: ", err);
  }
};
