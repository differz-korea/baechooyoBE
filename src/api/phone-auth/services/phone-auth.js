"use strict";

/**
 * phone-auth service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::phone-auth.phone-auth",
  ({ strapi }) => ({
    async checkAndUseKey(ctx) {
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
        await strapi.entityService.delete(
          "api::phone-auth.phone-auth",
          findedKey.id
        );
        return true;
      }
      return false;
    },
  })
);
