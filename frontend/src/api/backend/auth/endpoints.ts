// for dynamic string (id and token) ** /id/token
export type ResendEmailVerificationEndPoint = `/auth/emailVerification/${string}/${string}`;

export enum AuthEndPoints {
  SIGNUP = "/auth/signup",
  SIGNIN = "/auth/signin",
  SIGNOUT = "/auth/signout",
  GOOGLE_AUTH = "/auth/google",
  CURRENT_USER = "/auth/currentUser",
  EMAIL_VERIFICATION = "/auth/emailVerification",
  RESEND_EMAIL_VERIFICATION = "/auth/emailVerification/resend",
  SEND_RESET_PASSWORD_EMAIL = "/auth/sendResetPasswordEmail",
  RESET_PASSWORD = "/auth/resetPassword",
}
