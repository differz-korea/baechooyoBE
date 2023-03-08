"use strict";

/**
 * post service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::post.post", {
  async find(ctx) {
    let { page, limit, type } = ctx.query;
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
      where: {
        type,
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
});
