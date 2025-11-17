import Joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  API_VERSION: Joi.string().default('v1'),

  MONGODB_URI: Joi.string().required(),
  MONGODB_MAX_POOL_SIZE: Joi.number().default(10),
  MONGODB_MIN_POOL_SIZE: Joi.number().default(2),

  RELAYER_BASE_URL: Joi.string().uri().required(),
  RELAYER_TIMEOUT: Joi.number().default(30000),
  RELAYER_MAX_RETRIES: Joi.number().default(3),

  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
  LOG_DIR: Joi.string().default('./logs'),

  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),

  CORS_ORIGIN: Joi.string().default('*'),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  env: envVars.NODE_ENV as string,
  port: envVars.PORT as number,
  apiVersion: envVars.API_VERSION as string,

  mongodb: {
    uri: envVars.MONGODB_URI as string,
    maxPoolSize: envVars.MONGODB_MAX_POOL_SIZE as number,
    minPoolSize: envVars.MONGODB_MIN_POOL_SIZE as number,
  },

  relayer: {
    baseUrl: envVars.RELAYER_BASE_URL as string,
    timeout: envVars.RELAYER_TIMEOUT as number,
    maxRetries: envVars.RELAYER_MAX_RETRIES as number,
  },

  logging: {
    level: envVars.LOG_LEVEL as string,
    dir: envVars.LOG_DIR as string,
  },

  rateLimit: {
    windowMs: envVars.RATE_LIMIT_WINDOW_MS as number,
    maxRequests: envVars.RATE_LIMIT_MAX_REQUESTS as number,
  },

  cors: {
    origin: envVars.CORS_ORIGIN as string,
  },
};
