/**
 * Centralized env configuration. Reads from process.env (populated by
 * @nestjs/config, which loads the repo-root .env).
 */
export interface AppConfig {
  nodeEnv: string;
  apiPort: number;
  databaseUrl: string;
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessTtl: number;
    refreshTtl: number;
  };
  cookieDomain: string;
  corsOrigin: string;
}

export default (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  apiPort: Number(process.env.API_PORT ?? 4100),
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev_access_secret_change_me',
    refreshSecret:
      process.env.JWT_REFRESH_SECRET ?? 'dev_refresh_secret_change_me',
    accessTtl: Number(process.env.JWT_ACCESS_TTL ?? 900),
    refreshTtl: Number(process.env.JWT_REFRESH_TTL ?? 1209600),
  },
  cookieDomain: process.env.COOKIE_DOMAIN ?? 'localhost',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
});
