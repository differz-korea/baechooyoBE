module.exports = ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET", "BAECHOOOOODODO*&$#$%^&"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT", "BDAJJDKSFJJAKSFJKL"),
  },
});
