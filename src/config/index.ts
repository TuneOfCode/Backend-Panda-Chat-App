import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  HOST_SERVER,
  PORT,
  HOST_UPLOAD,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  CACHE_HOST,
  CACHE_PORT,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
} = process.env;
