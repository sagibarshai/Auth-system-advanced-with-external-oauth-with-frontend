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

export interface ApiResponseJson {
  message?: string;
  data?: Record<string, any>;
}
