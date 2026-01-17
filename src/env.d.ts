declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    MONGO_URI: string;
    JWT_SECRET: string;
    REFRESH_SECRET: string;
    EMAIL_USER: string;
    EMAIL_PASS: string;
    FRONTEND_URL: string;

    NODE_ENV: string;
    MAILTRAP_HOST: string;
    MAILTRAP_PORT: number;
    MAILTRAP_USER: string;
    MAILTRAP_PASS: string;
    EMAIL_FROM: string;

    R2_ACCOUNT_ID: string;
    R2_ACCESS_KEY_ID: string;
    R2_SECRETACCESSKEY_ID: string;
  }
}
