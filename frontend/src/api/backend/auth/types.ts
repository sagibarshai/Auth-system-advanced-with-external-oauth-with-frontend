export interface ApiResponseJson<T> {
  message?: string;
  data?: T;
}

export type CustomErrorMessage = {
  message: string;
  field?: string;
}[];

export interface SafeUser {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  registerAt: Date;
  updateAt: Date;
  lastLogin: Date;
  isVerified: boolean;
  provider: "app" | "google";
}

export interface ResendEmailVerification {
  remainAttempts: number;
  email: string;
}

export interface EmailVerificationResponse {
  email: string;
}
export interface SendResetPasswordEmailResponse {
  remainAttempts: number;
  email: string;
}
export interface ResetPasswordResponse {
  email: string;
}
