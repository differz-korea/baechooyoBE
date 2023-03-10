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
    async getByUser(ctx) {
      return await this.service.getDeliveryAgency({
        where: {
          user: ctx.state.user.id,
        },
        populate: {
          deliveryBrand: true,
          user: true,
          ratePlan: true,
          deliveryLocations: true,
        },
      });
    },
    async findOne(ctx) {
      return await strapi.entityService.findOne(
        "api::delivery-agency.delivery-agency",
        ctx.params.id,
        {
          populate: {
            //리뷰수, 리뷰 평균
            deliveryBrand: true,
            user: true,
            ratePlan: true,
            deliveryLocations: true,
          },
        }
      );
    },
    async getForMain(ctx) {
      const populateForMainPage = {
        deliveryBrand: true,
        ratePlan: true,
      };
      // 업체명, 영업시간, 평점평균 노출, 인증배찌, 쿠폰 노출 (전국 기준)
      // 1. 계약순서
      // 2. 리뷰수와 평점이 높은 순
      // 계약순서 순인 SQL이다.

      let sql = `select 
      max(contracts.status_at) as lastContract, 
      cd.delivery_agency_id as deliveryAgencyId
      from contracts, contracts_delivery_agency_links as cd 
      where contracts.id = cd.contract_id 
      and contracts.status='approved' 
      group by cd.delivery_agency_id
      order by lastContract desc
      limit 30;`;

      let [daIdList, meta] = await strapi.db.connection.raw(sql);

      const contractOrderList = [];

      await Promise.all(
        await daIdList.map(async ({ deliveryAgencyId }) => {
          const deliveryAgencyInfo = await strapi.entityService.findOne(
            "api::delivery-agency.delivery-agency",
            deliveryAgencyId,
            {
              populate: populateForMainPage,
            }
          );
          contractOrderList.push(deliveryAgencyInfo);
        })
      );
      sql = `SELECT avg(reviews.score) as avgScore, delivery_agency_id  as deliveryAgencyId
      FROM reviews, reviews_delivery_agency_links as rd 
      where reviews.id=rd.review_id 
      group by rd.delivery_agency_id
      order by avgScore desc limit 30;`;
      let scoreOrderList = [];
      [daIdList, meta] = await strapi.db.connection.raw(sql);
      await Promise.all(
        await daIdList.map(async ({ deliveryAgencyId, avgScore }) => {
          const deliveryAgencyInfo = await strapi.entityService.findOne(
            "api::delivery-agency.delivery-agency",
            deliveryAgencyId,
            {
              populate: populateForMainPage,
            }
          );
          scoreOrderList.push({ ...deliveryAgencyInfo, avgScore });
        })
      );
      return {
        contractOrderList,
        scoreOrderList,
      };
    },
    async getByLocations(ctx) {
      // 여러개 읍면동 코드를 통한 기준으로 찾아주는 메서드 이다.
      const delivery_locations = ctx.request.body.delivery_locations;
      // [배열형태로 보내도 되고], 일반 number로 보내도 된다
      return await this.service.getDeliveryAgencies({
        where: {
          delivery_locations,
        },
      });
    },
  })
);
