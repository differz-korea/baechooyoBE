"use strict";

/**
 * post controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::post.post", ({ strapi }) => ({
  async create(ctx) {
    await strapi.entityService.create("api::post.post", {
      data: {
        ...ctx.request.body,
        writer: ctx.state.user.id,
      },
    });
    return "";
  },
  async update(ctx) {
    delete ctx.request.body.writer;
    // 쓴 사용자 user 정보는 바꿀 수 없도록
    await strapi.entityService.update("api::post.post", ctx.params.id, {
      data: {
        ...ctx.request.body,
      },
    });
    return "";
  },
}));
