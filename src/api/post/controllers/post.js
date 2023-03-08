"use strict";

/**
 * post controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::post.post", ({ strapi }) => ({
  async find(ctx) {
    let { page, limit } = ctx.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const offset = (page - 1) * limit;
    const articles = await strapi.db.query("api::post.post").findWithCount({
      offset,
      limit,
      populate: {
        writer: {
          select: ["businessName", "id"],
        },
      },
      orderBy: {
        createdAt: "DESC",
      },
    });
    const totalPages = Math.ceil(articles[1] / limit);
    return {
      articles: articles[0],
      pagination: {
        page: page,
        pageSize: totalPages,
        total: articles[1],
      },
    };
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
}));
