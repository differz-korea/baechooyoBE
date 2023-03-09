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
            isExpired: false,
          },
          orderBy: {
            createdAt: "DESC",
          },
        });
      if (findedKey) {
        await strapi.entityService.update(
          "api::phone-auth.phone-auth",
          findedKey.id,
          {
            data: {
              isExpired: true,
            },
          }
        );
        return true;
      }
      return false;
    },
  })
);
