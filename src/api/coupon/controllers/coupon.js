"use strict";

const coupon = require("../routes/coupon");

/**
 * coupon controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::coupon.coupon", ({ strapi }) => ({
  //
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
    if (coupon) {
      await strapi.db.query("api::coupon.coupon").update({
        data: {
          title,
          content,
        },
        where: {
          deliveryAgency: delivery.id,
        },
      });
      return "쿠폰정보가 수정됨.";
    }

    const { title, content } = ctx.request.body;
    if (delivery.coupon) {
      return ctx.badRequest("이미 쿠폰이 등록됨");
    }
    await strapi.entityService.create("api::coupon.coupon", {
      data: {
        title,
        content,
        deliveryAgency: delivery.id,
      },
    });
    return "쿠폰이 등록됨";
  },
  /** 쿠폰 발급 API */
  async downloadCoupon(ctx) {
    /** id는 쿠폰 아이디 */
    //이미 사용되지 않은 해당 쿠폰이 이미 있지 않은지 확인,
    const downloadedCoupon = await strapi.db
      .query("api::coupon-box.coupon-box")
      .findOne({
        where: {
          coupon: ctx.params.id,
          user: ctx.state.user.id,
          isUsed: false,
        },
      });
    if (downloadedCoupon) {
      return ctx.badRequest(
        "이미 해당 쿠폰이 다운로드가 되어있으며, 사용되지도 않았습니다"
      );
    }
    await strapi.db.query("api::coupon-box.coupon-box").create({
      data: {
        user: ctx.state.user.id,
        coupon: ctx.params.id,
        isUsed: false,
      },
    });
    return "쿠폰이 발급됨";
  },
  //
  /** deliveryAgency detail 페이지에서 쿠폰을 따로 불러올 때, */
  async getCouponByDeliveryAgencyId(ctx) {
    /** id는 배달대행 업체 아이디 */
    const { id } = ctx.params;

    const coupon = await strapi.db.query("api::coupon.coupon").findOne({
      where: {
        deliveryAgency: id,
      },
    });
    if (!coupon) {
      return {
        coupon: null,
        canDownload: false,
      };
    }

    let 사용가능쿠폰 = null;
    if (ctx.state.user) {
      사용가능쿠폰 = await strapi.db
        .query("api::coupon-box.coupon-box")
        .findOne({
          where: {
            user: ctx.state.user.id,
            coupon: coupon.id,
            isUsed: false,
          },
        });
    }
    return {
      //쿠폰정보
      ...coupon,
      //발급 상태
      canDownload: 사용가능쿠폰 === null ? true : false,
    };
  },
  //
  async deleteCoupon(ctx) {
    // 쿠폰이 존재하는가?
    // 계정이 배달대행인가?
    // 쿠폰이 해당 배달대행사 소유인가?
  },
}));
