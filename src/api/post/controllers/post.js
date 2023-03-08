"use strict";

/**
 * post controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::post.post", ({ strapi }) => ({
  async find(ctx) {
    return await strapi.service("api::post.post").find(ctx);
  },
  async findByTitleOrContent(ctx) {
    return await strapi.service("api::post.post").find(ctx);
  },
  async findOne(ctx) {
    return await strapi.query("api::post.post").findOne({
      where: {
        id: ctx.params.id,
      },
      populate: {
        writer: {
          select: ["businessName", "id"],
        },
      },
    });
  },

  async create(ctx) {
    return await strapi.entityService.create("api::post.post", {
      data: {
        ...ctx.request.body,
        writer: ctx.state.user.id,
      },
    });
  },
  async update(ctx) {
    delete ctx.request.body.writer;
    // 쓴 사용자 user 정보는 바꿀 수 없도록
    return await strapi.entityService.update("api::post.post", ctx.params.id, {
      data: {
        ...ctx.request.body,
      },
    });
  },
  async delete(ctx) {
    return await strapi.entityService.delete("api::post.post", {
      where: {
        id: ctx.params.id,
      },
    });
  },
}));
