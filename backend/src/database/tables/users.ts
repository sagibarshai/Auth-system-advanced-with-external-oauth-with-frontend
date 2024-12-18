import { pgClient } from "../init";

export const createUsersTableIfNotExists = async () => {
  try {
    await pgClient.query(`CREATE TABLE IF NOT EXISTS Users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(200) CHECK(LENGTH(first_name) > 1),
        last_name VARCHAR(200) CHECK(LENGTH(last_name) > 1),
        email VARCHAR(255) CHECK(LENGTH(email) > 6) UNIQUE NOT NULL,
        password VARCHAR(255),
        register_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE NOT NULL,
        verification_token VARCHAR(255),
        phone_number VARCHAR(15),
        provider VARCHAR(25)
    );`);
    console.log(`Users table is ready!`);
  } catch (err) {
    console.log("Cannot create users table: ", err);
  }
};
