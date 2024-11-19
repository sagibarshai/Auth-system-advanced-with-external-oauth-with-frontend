import { pgClient } from "../../../database/init";

interface StoredUser {
  id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  password?: string;
  register_at: Date;
  updated_at: Date;
  last_login: Date;
  is_verified: boolean;
  verification_token?: string;
  phone_number?: string;
  provider: "app" | "google";
}

export interface ReturnedStoredUser {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  registerAt: Date;
  updateAt: Date;
  lastLogin: Date;
  isVerified: boolean;
  verificationToken?: string;
  provider: "app" | "google";
}

export interface SafeUser extends Omit<ReturnedStoredUser, "password" | "verificationToken"> {}

export interface NewUserPayload extends Omit<ReturnedStoredUser, "id" | "registerAt" | "updateAt" | "isVerified" | "lastLogin"> {}

const storedUserToReturnedStoredUser = (storedUser: StoredUser): SafeUser => {
  return {
    id: storedUser.id,
    firstName: storedUser.first_name,
    lastName: storedUser.last_name,
    email: storedUser.email,
    isVerified: storedUser.is_verified,
    lastLogin: storedUser.last_login,
    registerAt: storedUser.register_at,
    updateAt: storedUser.updated_at,
    phoneNumber: storedUser.phone_number,
    provider: storedUser.provider,
  };
};

export const InsertUserModel = async (user: NewUserPayload): Promise<{ safeUser: SafeUser; verificationToken: StoredUser["verification_token"] }> => {
  try {
    const randomToken = crypto.randomUUID();
    const response = await pgClient.query(
      `INSERT INTO Users 
        (first_name, last_name, email, password, phone_number, verification_token, provider) 
        VALUES
         ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *
         `,
      [user.firstName, user.lastName, user.email, user.password, user.phoneNumber, randomToken, "app"]
    );

    const storedUser = response.rows[0] as StoredUser;

    return { safeUser: storedUserToReturnedStoredUser(storedUser), verificationToken: randomToken };
  } catch (err) {
    throw err;
  }
};
export const InsertExternalUserModel = async (user: NewUserPayload): Promise<SafeUser> => {
  try {
    const response = await pgClient.query(
      `INSERT INTO Users 
        (first_name, last_name, email, provider, is_verified) 
        VALUES
         ($1, $2, $3, $4, true)
         RETURNING *
         `,
      [user.firstName, user.lastName, user.email, user.provider]
    );

    const storedUser = response.rows[0] as StoredUser;

    return storedUserToReturnedStoredUser(storedUser);
  } catch (err) {
    throw err;
  }
};

export const SelectUserModel = async (identifier: string | number): Promise<SafeUser | undefined> => {
  /** if identifier is number field = id, else field = email*/
  const field = typeof identifier === "number" ? "id" : "email";
  try {
    const response = await pgClient.query(
      `SELECT * FROM Users  
          WHERE ${field}=$1`,
      [identifier]
    );
    if (!response.rows.length) return;

    const storedUser = response.rows[0] as StoredUser;

    return storedUserToReturnedStoredUser(storedUser);
  } catch (err) {
    throw err;
  }
};

export const SelectUnsafeUserModel = async (identifier: string | number): Promise<ReturnedStoredUser | undefined> => {
  /** if identifier is number field = id, else field = email*/
  const field = typeof identifier === "number" ? "id" : "email";

  try {
    const response = await pgClient.query(
      `SELECT * FROM Users  
          WHERE ${field}=$1`,
      [identifier]
    );
    if (!response.rows.length) return;

    const storedUser = response.rows[0] as StoredUser;
    return { ...storedUserToReturnedStoredUser(storedUser), password: storedUser.password, verificationToken: storedUser.verification_token };
  } catch (err) {
    throw err;
  }
};

export const UpdateLoginModel = async (identifier: string | number): Promise<SafeUser> => {
  const field = typeof identifier === "number" ? "id" : "email";

  try {
    const response = await pgClient.query(
      `UPDATE Users  
       SET last_login = $1
       WHERE ${field} = $2
       RETURNING *;`,
      [new Date(), identifier]
    );

    if (!response.rows.length) throw new Error(`User with ${field} : ${identifier} not found `);
    const storedUser = response.rows[0] as StoredUser;

    return storedUserToReturnedStoredUser(storedUser);
  } catch (err) {
    console.log("err1 ", err);
    throw err;
  }
};
export const UpdateUserIsVerifyModel = async (identifier: string | number): Promise<SafeUser> => {
  const field = typeof identifier === "number" ? "id" : "email";

  try {
    const response = await pgClient.query(
      `UPDATE Users  
       SET is_verified = $1
       WHERE ${field} = $2
       RETURNING *;`,
      [true, identifier]
    );

    if (!response.rows.length) throw new Error(`User with ${field} : ${identifier} not found `);
    const storedUser = response.rows[0] as StoredUser;

    return storedUserToReturnedStoredUser(storedUser);
  } catch (err) {
    throw err;
  }
};
