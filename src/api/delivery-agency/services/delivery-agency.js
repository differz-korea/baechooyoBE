"use strict";

const getDeliveryAgency = require("../middlewares/get-delivery-agency");

/**
 * delivery-agency service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::delivery-agency.delivery-agency",
  ({ strapi }) => ({
    async getDeliveryAgency(condition) {
      const deliveryAgencyRepository = strapi.db.query(
        "api::delivery-agency.delivery-agency"
      );
      return await deliveryAgencyRepository.findOne(condition);
    },

    async getDeliveryAgencies(condition) {
      const deliveryAgencyRepository = strapi.db.query(
        "api::delivery-agency.delivery-agency"
      );
      return await deliveryAgencyRepository.findMany(condition);
    },

    /** 배달대행 업체 정보를 추가한다. */
    async registerOrEdit({ deliveryAgencyInfo, user }) {
      const deliveryAgencyRepository = strapi.db.query(
        "api::delivery-agency.delivery-agency"
      );
      const exsist = await this.getDeliveryAgency({ user: user.id });
      if (exsist) {
        //** 이미 배달 대행 정보가 등록이 되어있는 경우 */
        return await deliveryAgencyRepository.update({
          data: deliveryAgencyInfo,
          where: {
            id: exsist.id,
          },
        });
      }
      /** 배달 대행 정보가 등록이 되어있지 않은 경우 */
      return await strapi.entityService.create(
        "api::delivery-agency.delivery-agency",
        {
          data: {
            ...deliveryAgencyInfo,
            user: user.id,
            name: user.businessName,
          },
        }
      );
    },
  })
);
