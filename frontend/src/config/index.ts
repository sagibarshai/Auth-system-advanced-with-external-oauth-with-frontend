const isProd = process.env.NODE_ENV === "production";

if (!process.env.BACKEND_PORT) throw new Error("BACKEND_PORT must be define");

export const config = {
  PROD: isProd,
  BACKEND: {
    BASE_URL: isProd ? "https://ProductionDomainUrl.com" : `http://localhost:${process.env.BACKEND_PORT}/api`,
  },
};
