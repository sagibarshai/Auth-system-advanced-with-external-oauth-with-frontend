import { pgClient } from "../../../database/init";

interface StoredEmailVerification {
  id: number;
  email: string;
  user_id: number;
  verification_token: string;
  is_sent: boolean;
  created_at: Date;
  updated_at: Date;
  attempts: number;
  expired_in: Date;
}
export interface ReturnedEmailVerification {
  id: number;
  email: string;
  userId: number;
  isSent: boolean;
  createdAt: Date;
  updatedAt: Date;
  attempts: number;
  verificationToken: string;
  expiredIn: Date;
}
interface EmailVerificationPayload extends Omit<ReturnedEmailVerification, "id" | "createdAt" | "updatedAt" | "attempts"> {}

const storedEmailVerificationsToReturnedEmailVerifications = (emailVerification: StoredEmailVerification): ReturnedEmailVerification => {
  return {
    id: emailVerification.id,
    userId: emailVerification.user_id,
    email: emailVerification.email,
    createdAt: emailVerification.created_at,
    attempts: emailVerification.attempts,
    updatedAt: emailVerification.updated_at,
    isSent: emailVerification.is_sent,
    verificationToken: emailVerification.verification_token,
    expiredIn: emailVerification.expired_in,
  };
};

export const UpsertEmailVerificationModel = async (emailVerificationPayload: EmailVerificationPayload): Promise<ReturnedEmailVerification> => {
  try {
    const response = await pgClient.query(
      `
        INSERT INTO Email_Verifications
        (email, user_id, is_sent, attempts, verification_token, expired_in)
        VALUES 
        ($1, $2, $3, 1, $5, $6)
        ON CONFLICT (email)
        DO UPDATE SET 
          updated_at = $4,
          is_sent = $3,
          attempts = Email_Verifications.attempts + 1,
          verification_token = $5,
          expired_in = $6
        RETURNING *;
      `,
      [
        emailVerificationPayload.email,
        emailVerificationPayload.userId,
        emailVerificationPayload.isSent,
        new Date(),
        emailVerificationPayload.verificationToken,
        emailVerificationPayload.expiredIn,
      ]
    );

    const storedEmailVerification = response.rows[0] as StoredEmailVerification;

    return storedEmailVerificationsToReturnedEmailVerifications(storedEmailVerification);
  } catch (err) {
    throw err;
  }
};

export const SelectEmailVerificationModel = async (email: string): Promise<ReturnedEmailVerification | undefined> => {
  try {
    const response = await pgClient.query(
      `
          SELECT * FROM Email_Verifications WHERE email=$1
          `,
      [email]
    );
    const storedEmailVerification = response.rows[0] as StoredEmailVerification | undefined;
    if (!storedEmailVerification) return;

    return storedEmailVerificationsToReturnedEmailVerifications(storedEmailVerification);
  } catch (err) {
    throw err;
  }
};

// this two model below is for future use if needed
export const NewEmailVerificationModel = async (emailVerificationPayload: EmailVerificationPayload): Promise<ReturnedEmailVerification> => {
  try {
    const response = await pgClient.query(
      `INSERT INTO Email_Verifications
        (email, user_id, is_sent, attempts, verification_token)
        VALUES 
        ($1,$2,$3,$4,$5)
        RETURNING *
         `,
      [emailVerificationPayload.email, emailVerificationPayload.userId, emailVerificationPayload.isSent, 1, crypto.randomUUID()]
    );

    const storedEmailVerification = response.rows[0] as StoredEmailVerification;

    return storedEmailVerificationsToReturnedEmailVerifications(storedEmailVerification);
  } catch (err) {
    throw err;
  }
};

export const UpdateEmailVerificationModel = async (emailVerificationPayload: EmailVerificationPayload): Promise<ReturnedEmailVerification> => {
  try {
    const response = await pgClient.query(
      `UPDATE Email_Verifications
        SET updated_at=$1,
        is_sent=$2,
        attempts = attempts + 1
        WHERE email=$3
        RETURNING *
         `,
      [new Date(), emailVerificationPayload.isSent, emailVerificationPayload.email]
    );
    if (!response.rows.length) throw new Error(`Email Verification with email ${emailVerificationPayload.email} not found `);
    const storedEmailVerification = response.rows[0] as StoredEmailVerification;

    return storedEmailVerificationsToReturnedEmailVerifications(storedEmailVerification);
  } catch (err) {
    throw err;
  }
};
//

export const DeleteEmailVerificationModel = async (email: string): Promise<ReturnedEmailVerification | undefined> => {
  try {
    const response = await pgClient.query(
      `
          DELETE FROM Email_Verifications WHERE email=$1
          `,
      [email]
    );
    const storedEmailVerification = response.rows[0] as StoredEmailVerification | undefined;
    if (!storedEmailVerification) return;

    return storedEmailVerificationsToReturnedEmailVerifications(storedEmailVerification);
  } catch (err) {
    throw err;
  }
};
