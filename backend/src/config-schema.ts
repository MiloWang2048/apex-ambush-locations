import * as joi from 'joi';

export const ConfigSchema = joi.object({
  MODE: joi.string().valid('development', 'production').default('production'),
  PORT: joi.number().default(3000),

  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().default(3306),
  DB_USER: joi.string().required(),
  DB_PASSWD: joi.string().required(),
  DB_DATABASE: joi.string().default('apex_ambush'),
});
