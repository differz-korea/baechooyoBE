"use strict";

/**
 * comment controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::comment.comment", ({ strapi }) => ({
  async create(ctx) {
    await strapi.entityService.create("api::comment.comment", {
      data: {
        ...ctx.request.body,
        writer: ctx.state.user.id,
      },
    });
    return "";
  },
}));
