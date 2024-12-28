import { pgClient } from "../../../database/init";

interface StoredResetPassword {
  id: number;
  email: string;
  user_id: number;
  verification_token: string;
  is_sent: boolean;
  created_at: Date;
  updated_at: Date;
  attempts: number;
  expired_in: Date;
  is_last_reset_completed: boolean;
}
export interface ReturnedResetPassword {
  id: number;
  email: string;
  userId: number;
  isSent: boolean;
  createdAt: Date;
  updatedAt: Date;
  attempts: number;
  verificationToken: string;
  expiredIn: Date;
  isLastResetCompleted: boolean;
}
interface ResetPasswordPayload extends Omit<ReturnedResetPassword, "id" | "createdAt" | "updatedAt" | "attempts" | "isLastResetCompleted"> {}

const storedResetPasswordToReturnedResetPassword = (resetPassword: StoredResetPassword): ReturnedResetPassword => {
  return {
    id: resetPassword.id,
    userId: resetPassword.user_id,
    email: resetPassword.email,
    createdAt: resetPassword.created_at,
    attempts: resetPassword.attempts,
    updatedAt: resetPassword.updated_at,
    isSent: resetPassword.is_sent,
    verificationToken: resetPassword.verification_token,
    expiredIn: resetPassword.expired_in,
    isLastResetCompleted: resetPassword.is_last_reset_completed,
  };
};

export const UpsertResetPasswordModel = async (resetPasswordPayload: ResetPasswordPayload): Promise<ReturnedResetPassword> => {
  try {
    const response = await pgClient.query(
      `
        INSERT INTO Reset_Password
        (email, user_id, is_sent, attempts, verification_token, expired_in,is_last_reset_completed)
        VALUES 
        ($1, $2, $3, 1, $5, $6, $7)
        ON CONFLICT (email)
        DO UPDATE SET 
          updated_at = $4,
          is_sent = $3,
          attempts = Reset_Password.attempts + 1,
          verification_token = $5,
          expired_in = $6,
          is_last_reset_completed=$7
        RETURNING *;
      `,
      [
        resetPasswordPayload.email,
        resetPasswordPayload.userId,
        resetPasswordPayload.isSent,
        new Date(),
        resetPasswordPayload.verificationToken,
        resetPasswordPayload.expiredIn,
        false,
      ]
    );

    const storedResetPassword = response.rows[0] as StoredResetPassword;

    return storedResetPasswordToReturnedResetPassword(storedResetPassword);
  } catch (err) {
    throw err;
  }
};

export const SelectResetPasswordModel = async (email: string): Promise<ReturnedResetPassword | undefined> => {
  try {
    const response = await pgClient.query(
      `
          SELECT * FROM Reset_Password WHERE email=$1
          `,
      [email]
    );
    const storedResetPassword = response.rows[0] as StoredResetPassword | undefined;
    if (!storedResetPassword) return;

    return storedResetPasswordToReturnedResetPassword(storedResetPassword);
  } catch (err) {
    throw err;
  }
};

// this two model below is for future use if needed
export const NewResetPasswordModel = async (resetPasswordPayload: ResetPasswordPayload): Promise<ReturnedResetPassword> => {
  try {
    const response = await pgClient.query(
      `INSERT INTO Reset_Password
        (email, user_id, is_sent, attempts, verification_token)
        VALUES 
        ($1,$2,$3,$4,$5)
        RETURNING *
         `,
      [resetPasswordPayload.email, resetPasswordPayload.userId, resetPasswordPayload.isSent, 1, crypto.randomUUID()]
    );

    const storedResetPassword = response.rows[0] as StoredResetPassword;

    return storedResetPasswordToReturnedResetPassword(storedResetPassword);
  } catch (err) {
    throw err;
  }
};

export const UpdateResetPasswordModel = async (resetPasswordPayload: ResetPasswordPayload): Promise<ReturnedResetPassword> => {
  try {
    const response = await pgClient.query(
      `UPDATE Reset_Password
        SET updated_at=$1,
        is_sent=$2,
        attempts = attempts + 1
        WHERE email=$3
        RETURNING *
         `,
      [new Date(), resetPasswordPayload.isSent, resetPasswordPayload.email]
    );
    if (!response.rows.length) throw new Error(`Reset Password with email ${resetPasswordPayload.email} not found `);
    const storedResetPassword = response.rows[0] as StoredResetPassword;

    return storedResetPasswordToReturnedResetPassword(storedResetPassword);
  } catch (err) {
    throw err;
  }
};
export const UpdateIsLastResetCompleted = async (email: string, isLastResetCompleted: boolean): Promise<ReturnedResetPassword> => {
  try {
    const response = await pgClient.query(
      `UPDATE Reset_Password
        SET is_last_reset_completed=$1
        WHERE email=$2
        RETURNING *
         `,
      [isLastResetCompleted, email]
    );
    if (!response.rows.length)
      throw new Error(`Update is_last_reset_completed on Reset Password Table filed for user with email ${email} not found `);
    const storedResetPassword = response.rows[0] as StoredResetPassword;

    return storedResetPasswordToReturnedResetPassword(storedResetPassword);
  } catch (err) {
    throw err;
  }
};
//

export const DeleteResetPasswordModel = async (email: string): Promise<ReturnedResetPassword | undefined> => {
  try {
    const response = await pgClient.query(
      `
          DELETE FROM Reset_Password WHERE email=$1
          `,
      [email]
    );
    const storedResetPassword = response.rows[0] as StoredResetPassword | undefined;
    if (!storedResetPassword) return;

    return storedResetPasswordToReturnedResetPassword(storedResetPassword);
  } catch (err) {
    throw err;
  }
};
