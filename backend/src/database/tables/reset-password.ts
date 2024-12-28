import { pgClient } from "../init";

export const CreateResetPasswordTableIfNotExists = async () => {
  try {
    await pgClient.query(`
                    CREATE TABLE IF NOT EXISTS Reset_Password
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
    console.log(`Reset_Password table is ready!`);
  } catch (err) {
    console.log("Cannot Create table Reset_Password: ", err);
  }
};
