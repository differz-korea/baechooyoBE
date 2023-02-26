"use strict";

/**
 * delivery-agency controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::delivery-agency.delivery-agency",
  ({ strapi }) => ({
    service: strapi.service("api::delivery-agency.delivery-agency"),
    async registerOrEdit(ctx) {
      return await this.service.registerOrEdit({
        deliveryAgencyInfo: ctx.request.body,
        user: ctx.state.user,
      });
    },
    async getById(ctx) {
      const deliveryAgencyId = ctx.params.id;
      return await this.service.getDeliveryAgency({
        where: {
          id: deliveryAgencyId,
        },
      });
    },
    async getByUser(ctx) {
      return await this.service.getDeliveryAgency({
        where: {
          user: ctx.state.user.id,
        },
      });
    },
    async getForMain(ctx) {
      // 업체명/영업시간/리뷰와 평점 노출
      // 인증배찌/쿠폰 노출
      // 선택된 첫번쨰 타이틀에서는 [계약 순]
      // 그 아래 타이틀의 경우 [리뷰,평점 순]
      // 전국 기준입니다.
    },
    async getByLocations(ctx) {
      // 여러개 읍면동 코드를 통한 기준으로 찾아주는 메서드 이다.
      const delivery_locations = ctx.request.body.delivery_locations;
      return await this.service.getDeliveryAgencies({
        where: {
          delivery_locations,
        },
      });
    },
  })
);
