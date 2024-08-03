import Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('develop', 'production', 'test', 'local')
    .default('local'),
  PORT: Joi.number().port().default(5000),
  SERVER_DOMAIN: Joi.string().required(),

  CONTACT_EMAIL: Joi.string().default('dev.music.diary@gmail.com'),
  AI_URL: Joi.string().required(),

  DATABASE_URL: Joi.string().required(),
  REDIS_URL: Joi.string().required(),

  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRE_IN: Joi.string().required(),

  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
});
