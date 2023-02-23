"use strict";

const getDeliveryAgency = require("../middlewares/get-delivery-agency");

/**
 * delivery-agency service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::delivery-agency.delivery-agency",
  ({ strapi }) => ({
    ctx: strapi.requestContext.get(),
    /** 배달대행정보를 get하는 메소드 */
    async getDeliveryAgencyById(id) {
      return await strapi.entityService.findOne(
        "api::delivery-agency.delivery-agency",
        id
      );
    },
    async getDeliveryAgency(condition) {
      return await strapi.db
        .query("api::delivery-agency.delivery-agency")
        .findOne({
          condition,
        });
    },
    /** 해당하는 사업에 배달대행 업체 정보를 추가한다. */
    async registerOrEdit({ deliveryAgencyInfo, user, business }) {
      const exsist = await this.getDeliveryAgency({ user: user.id });
      if (exsist) {
        //** 이미 배달 대행 정보가 등록이 되어있는 경우 */
        return await strapi.entityService.update(
          "api::delivery-agency.delivery-agency",
          exsist.id,
          {
            data: deliveryAgencyInfo,
          }
        );
      }
      /** 배달 대행 정보가 등록이 되어있지 않은 경우 */
      return await strapi.db
        .query("api::delivery-agency.delivery-agency")
        .create({
          data: {
            ...deliveryAgencyInfo,
            user: user.id,
            business: business.id,
          },
        });
    },
    /** 자신의 배달 대행 정보를 삭제하는 메소드 */
    async delete(id) {
      return await strapi.db
        .query("api::delivery-agency.delivery-agency")
        .delete({
          where: {
            id,
          },
        });
    },
  })
);
