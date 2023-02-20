"use strict";

/**
 * business controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::business.business",
  ({ strapi }) => ({
    async create(ctx) {
      // const { number, name, location, isApproved } = ctx.body;
      // const entity = await strapi.service('api::restaurant.restaurant').create(id, query);
      // const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

      // return this.transformResponse(sanitizedEntity);
      console.log(ctx.body);
    },
  })
);
