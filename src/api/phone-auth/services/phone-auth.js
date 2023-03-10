"use strict";

/**
 * phone-auth service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::phone-auth.phone-auth",
  ({ strapi }) => ({
    async checkAndUseKey(phoneNumber, key) {
      const findedKey = await strapi.db
        .query("api::phone-auth.phone-auth")
        .findOne({
          where: {
            phoneNumber,
            key,
            isAuthenticated: true,
          },
          orderBy: {
            createdAt: "DESC",
          },
        });
      if (findedKey) {
        return true;
      }
      return false;
    },
  })
);
