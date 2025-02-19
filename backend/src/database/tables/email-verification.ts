import { pgClient } from "../init";

export const CreateEmailVerificationsTableIfNotExists = async () => {
  try {
    await pgClient.query(`
                    CREATE TABLE IF NOT EXISTS Email_Verifications
                    (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) NOT NULL CHECK(LENGTH(email) > 6) UNIQUE REFERENCES Users(email) ON DELETE CASCADE ON UPDATE CASCADE,
                    user_id INT REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
                    verification_token VARCHAR(255),
                    is_sent BOOLEAN NOT NULL, 
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    expired_in TIMESTAMP NOT NULL,
                    attempts INT NOT NULL DEFAULT 0
                    ); 
                    `);
    console.log(`Email_Verifications table is ready!`);
  } catch (err) {
    console.log("Cannot Create table Email_Verifications: ", err);
  }
};
