"use strict";

/**
 * business controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::business.business",
  ({ strapi }) => ({
    async register(ctx) {
      return await strapi
        .service("api::business.business")
        .test({ businessInfo: ctx.request.body, user: ctx.state.user });
    },
    async edit(ctx) {},
    async delete(ctx) {},
  })
);
