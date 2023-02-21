"use strict";

/**
 * delivery-agency service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::delivery-agency.delivery-agency",
  ({ strapi }) => ({
    async register({ deliveryAgencyInfo, business }) {
      /** 이미 비즈니스가 delivery-agency를 가지고 있지 않은지 체크한다 */
      const exsistDeliveryAgency = await strapi.db
        .query("api::delivery-agency.delivery-agency")
        .findOne({
          where: {
            business: business.id,
          },
        });
      if (exsistDeliveryAgency) {
        return {
          message: "이미 고객님은 배달업체를 등록하셨습니다",
        };
      }
      return await strapi.entityService.create(
        "api::delivery-agency.delivery-agency",
        {
          data: {
            ...deliveryAgencyInfo,
            business: business.id,
          },
        }
      );
    },
  })
);
