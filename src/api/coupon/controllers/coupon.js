"use strict";

const coupon = require("../routes/coupon");

/**
 * coupon controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::coupon.coupon", ({ strapi }) => ({
  async setCoupon(ctx) {
    // 계정의 배달대행 정보의 isRegistered가 true인가?
    const delivery = await strapi.db
      .query("api::delivery-agency.delivery-agency")
      .findOne({
        where: {
          user: ctx.state.user.id,
        },
        populate: ["coupon"],
      });

    if (!delivery || delivery.isRegistered !== true) {
      return ctx.badRequest(
        "배달 대행 정보가 등록이 모두 완료되어야 쿠폰을 등록 할 수 있습니다!"
      );
    }

    if (delivery.coupon) {
      return ctx.badRequest("이미 쿠폰이 등록되어있습니다");
    }

    const { title, content } = ctx.request.body;

    await strapi.entityService.create("api::coupon.coupon", {
      data: {
        title,
        content,
        deliveryAgency: delivery.id,
      },
    });
    return "쿠폰이 등록됨";
  },
  async delete(ctx) {
    // 쿠폰이 존재하는가?
    // 계정이 배달대행인가?
    // 쿠폰이 해당 배달대행사 소유인가?
  },
}));
