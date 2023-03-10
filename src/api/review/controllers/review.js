"use strict";

/**
 * review controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::review.review", ({ strapi }) => ({
  // 리뷰 작성
  async create(ctx) {
    const { deliveryAgency, score, content } = ctx.request.body;
    // 1. 해당업체와의 체결된 계약이 존재하는지, 계약 응답일로부터 7일이 지났는지 체크
    await strapi
      .service("api::contract.contract")
      .canCreateReview(ctx.state.user.id, deliveryAgency);
    //2. 리뷰를 남긴다.
    await strapi.entityService.create("api::review.review", {
      data: {
        deliveryAgency,
        score,
        content,
        writer: ctx.state.user.id,
      },
    });
  },
  async find(ctx) {
    let { page, limit } = ctx.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    const articles = await strapi.db.query("api::review.review").findWithCount({
      offset,
      limit,
      where: { deliveryAgency: ctx.query.deliveryAgency },
      populate: {
        writer: {
          select: [businessName, id],
        },
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
  // 리뷰 삭제
  async delete(ctx) {
    const reviewId = ctx.params.id;
    //1. 리뷰가 사용자가 쓴것이 맞는지 확인한다.
    const review = await strapi.entityService.findOne(
      "api::review.review",
      reviewId
    );
    if (!review) {
      return ctx.badRequest("존재하지 않는 리뷰");
    }
    if (review.writer.id !== ctx.state.user.id) {
      return ctx.badRequest("고객님이 쓴 댓글이 아닙니다!");
    }
    await strapi.entityService.delete("api::review.review", reviewId);
    //2. 리뷰를 삭제한다.
    return "";
  },
}));
