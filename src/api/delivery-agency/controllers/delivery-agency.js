"use strict";

/**
 * delivery-agency controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::delivery-agency.delivery-agency",
  ({ strapi }) => ({
    async register(ctx) {},
    async edit(ctx) {},
    async delete(ctx) {},
  })
);
