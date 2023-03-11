"use strict";

/**
 * delivery-agency service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::delivery-agency.delivery-agency",
  ({ strapi }) => ({
    async getDeliveryAgency(where) {
      const deliveryAgency = await strapi.db
        .query("api::delivery-agency.delivery-agency")
        .findOne({
          populate: {
            deliveryBrand: true,
            user: {
              // 상호명, 개업일자
              select: ["businessName", "startDate", "id"],
            },
            deliveryLocations: {
              select: ["id", "SIDO", "SIGUNGU", "EUPMEONDONG"],
            },
            deliveryAgencyImages: {
              select: ["id", "url"],
            },
            documentOfInsurance: {
              select: ["id", "url"],
            },
          },
          ratePlan: true,
          where,
        });
      return deliveryAgency;
    },

    async createEmptySheet(userId) {
      return await strapi.db
        .query("api::delivery-agency.delivery-agency")
        .create({
          data: {
            user: userId,
          },
          populate: {
            deliveryBrand: true,
            user: {
              // 상호명, 개업일자
              select: ["businessName", "startDate", "id"],
            },
            deliveryLocations: {
              select: ["id", "SIDO", "SIGUNGU", "EUPMEONDONG"],
            },
            deliveryAgencyImages: {
              select: ["id", "url"],
            },
            documentOfInsurance: {
              select: ["id", "url"],
            },
          },
          ratePlan: true,
        });
    },

    async getDeliveryAgencies(condition) {
      const deliveryAgencyRepository = strapi.db.query(
        "api::delivery-agency.delivery-agency"
      );
      // 별점 계산해서 내보내주세요.
      return await deliveryAgencyRepository.findMany(condition);
    },

    /** 배달대행 업체 정보를 추가한다. */
    async updateInfo({ deliveryAgencyInfo, user, files }) {
      // 배달대행정보를 업데이트시킨다.
      return await strapi.entityService.update(
        "api::delivery-agency.delivery-agency",
        exist.id,
        {
          data: deliveryAgencyInfo,
          files,
        }
      );
    },
  })
);
