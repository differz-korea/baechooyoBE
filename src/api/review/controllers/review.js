"use strict";

/**
 * review controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::review.review", ({ strapi }) => ({
  // 리뷰 작성
  async create(ctx) {
    const { deliveryAgency, score, content } = ctx.request.body;
    const existContract = await strapi
      .service("api::contract.contract")
      .checkContractInProgress(ctx.state.user.id, deliveryAgency);
    if (!existContract) {
      return ctx.response.badRequest("해당 업체와 체결된 계약이 없습니다");
    }
    //2. 리뷰를 남긴다.
  },
  // 리뷰 삭제
  async delete(ctx) {
    const reviewId = ctx.params.id;
    //1. 리뷰가 사용자가 쓴것이 맞는지 확인한다.
    //2. 리뷰를 삭제한다.
  },
}));
