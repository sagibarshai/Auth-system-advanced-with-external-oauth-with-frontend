const isProd = process.env.NODE_ENV === "production";

export const config = {
  PROD: isProd,
  BACKEND: {
    BASE_URL: isProd ? "https://ProductionDomainUrl.com" : "http://localhost:4000/api",
  },
};
