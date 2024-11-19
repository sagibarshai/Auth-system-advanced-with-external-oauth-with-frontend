import "dotenv/config";

if (!process.env.JWT_KEY) {
  throw new Error("PASSWORD_SALT must be define inside .env file");
}
if (!process.env.COOKIE_SECRET) {
  throw new Error("COOKIE_SECRET must be define inside .env file");
}
if (!process.env.EMAIL_ACCESS_KEY) {
  throw new Error("EMAIL_ACCESS_KEY must be define inside .env file");
}
if (!process.env.EMAIL_ADDRESS) {
  throw new Error("EMAIL_ADDRESS must be define inside .env file");
}
if (!process.env.POSTGRES_USER) {
  throw new Error("POSTGRES_USER must be define inside .env file");
}
if (!process.env.POSTGRES_PASSWORD) {
  throw new Error("POSTGRES_PASSWORD must be define inside .env file");
}
if (!process.env.POSTGRES_DATABASE) {
  throw new Error("POSTGRES_DATABASE must be define inside .env file");
}
if (!process.env.POSTGRES_PORT) {
  throw new Error("POSTGRES_PORT must be define inside .env file");
}
if (!process.env.POSTGRES_DB) {
  throw new Error("POSTGRES_DB must be define inside .env file");
}
if (!process.env.POSTGRES_HOST) {
  throw new Error("POSTGRES_HOST must be define inside .env file");
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_SECRET must be define inside .env file");
}
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID must be define inside .env file");
}
if (!process.env.GOOGLE_CALLBACK_ENDPOINT) {
  throw new Error("GOOGLE_CALLBACK_ENDPOINT must be define inside .env file");
}
if (!process.env.JWT_EXPIRED_IN) {
  console.warn("JWT_EXPIRED_IN can be define inside .env file");
}
if (!process.env.COOKIES_EXPIRED_IN) {
  console.warn("COOKIES_EXPIRED_IN can be define inside .env file");
}

const isProd = Boolean(process.env.NODE_ENV);

const baseURL = isProd ? "https://ProductionDomainUrl.com" : "http://localhost";
const port = Number(process.env.PORT);

export const config = {
  PORT: port,
  PROD: isProd,
  BASE_URL: baseURL,
  JWT: {
    EXPIRED_IN: Number(process.env.JWT_EXPIRED_IN) || 60 * 30, // in 's'
  },
  COOKIES: {
    JWT_COOKIE_EXPIRED_IN: Number(process.env.COOKIES_EXPIRED_IN) || 60 * 60 * 1000, // in 'ms'
  },
  MAIL: {
    FROM: "noreply@emailverifyee.com",
    SERVICE: "Gmail",
    HOST: "smtp.gmail.com",
    SECURE: true,
    PORT: 465,
    AUTH: {
      USER: process.env.EMAIL_ADDRESS,
      PASS: process.env.EMAIL_ACCESS_KEY,
    },
  },
  POSTGRES: {
    USER: process.env.POSTGRES_USER,
    PASSWORD: process.env.POSTGRES_PASSWORD,
    DATABASE: process.env.POSTGRES_DATABASE,
    PORT: Number(process.env.POSTGRES_PORT),
    HOST: process.env.POSTGRES_HOST,
    SSL: false,
  },
  EMAIL_VERIFICATION: {
    MAX_ATTEMPT: 3,
  },
  GOOGLE_OAUTH: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: `${baseURL}:${port}${process.env.GOOGLE_CALLBACK_ENDPOINT}`,
  },
};
