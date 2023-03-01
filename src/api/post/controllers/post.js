"use strict";

/**
 * post controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::post.post", ({ strapi }) => ({
  async create(ctx) {
    return await strapi.entityService.create("api::post.post", {
      data: {
        ...ctx.request.body,
        user: ctx.state.user.id,
      },
    });
  },
  async update(ctx) {
    const { title, content, type } = ctx.request.body;
    // 쓴 사용자 user 정보는 바꿀 수 없도록
    return await strapi.entityService.update("api::post.post", ctx.params.id, {
      data: {
        title,
        content,
        type,
      },
    });
  },
}));
