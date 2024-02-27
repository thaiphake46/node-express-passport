const { cleanEnv, port, str } = require('envalid')

const env = cleanEnv(process.env, {
  PORT: port(),
  SESSION_SECRET: str(),
  MONGO_CONNECT_STRING: str(),

  JWT_SECRET_ACCESS_TOKEN: str(),
  JWT_SECRET_REFRESH_TOKEN: str(),
  JWT_MAX_AGE_ACCESS_TOKEN: str(),
  JWT_MAX_AGE_REFRESH_TOKEN: str(),

  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),
})

export default env
