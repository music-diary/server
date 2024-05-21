import Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('develop', 'production', 'test', 'local')
    .default('local'),
  PORT: Joi.number().port().default(5000),
  DATABASE_URL: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
});
