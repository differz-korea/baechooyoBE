"use strict";

/**
 * delivery-agency controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::delivery-agency.delivery-agency",
  ({ strapi }) => ({
    service: strapi.service("api::delivery-agency.delivery-agency"),
    //
    //배달대행 정보를 등록 및 저장하는 API이다.
    async registerDeliveryAgencyInfo(ctx) {
      //이것을 요청하기전 프론트에서 validation 작업을 꼭꼭 해주어야함!!

      //이것을 처음으로 요청하게 되면, 이제 디테일 페이지 및 메인페이지에 뜰 수 있는 자격이 된다.
      // 처음에는 isRegistered가 false였기 때문에 등록이 다 된 상태가 아닌것이고,
      // 등록을 하게 되면 isRegistered가 true로 바뀌게 된다.
      return await this.service.updateInfo({
        deliveryAgencyInfo: {
          ...ctx.request.body,
          isRegistered: true,
        },
        files: ctx.request.files,
        user: ctx.state.user,
      });
    },
    //
    // 자신의 배달대행정보 등록 및 저장 페이지 접근시 반환하는 API이다.
    async getForRegisterPage(ctx) {
      const deliveryAgencyInfo = await this.service.getDeliveryAgency({
        user: ctx.state.user.id,
      });
      if (!deliveryAgencyInfo) {
        return this.service.createEmptySheet(ctx.state.user.id);
      }
      return deliveryAgencyInfo;
    },
    //
    /** 배달대행 DETAIL 페이지에 사용하는 API */
    async getForDetailPage(ctx) {
      // 모두가 보는 페이지
      const deliveryInfo = await this.service.getDeliveryAgency({
        id: ctx.params.id,
        isRegistered: true,
      });
      // 디테일페이지 계약중인 계약 수를 표시해주어야하기 때문에
      // 진행중인 계약수 contractService에 contractsCondition 메서드를 deliveryAgencyId로 호출하여 가져오기
      const contractsOnProcessing = await strapi
        .service("api::contract.contract")
        .contractsCondition(ctx.params.id, "approved", false);
      return {
        ...deliveryInfo,
        contractsOnProcessing,
      };
    },

    async deleteImage(ctx) {
      const exist = await this.service.getDeliveryAgency({
        user: ctx.state.user.id,
      });
      const imageId = ctx.query.imageId;
      const imageKey = ctx.query.imageKey;
      if (
        !exist?.[imageKey]?.find((d) => {
          return d.id == imageId;
        })
      ) {
        return ctx.badRequest(
          "이미지 키를 잘못보냈거나, 자신이 업로드 한 이미지가 아닙니다."
        );
      }
      const imageEntry = await strapi.db.query("plugin::upload.file").delete({
        where: { id: ctx.query.imageId },
      });
      strapi.plugins.upload.services.upload.remove(imageEntry);
      return "올바르게 이미지가 삭제됨";
    },

    //
    //
    //
    //
    //
    //

    async getForMain(ctx) {
      const populateForMainPage = {
        deliveryBrand: true,
        ratePlan: true,
      };
      // 업체명, 영업시간, 평점평균 노출, 인증배찌, 쿠폰 노출 (전국 기준)
      // 1. 최근 계 약순서
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
      const deliveryLocations = ctx.request.body.deliveryLocations;
      // [배열형태로 보내도 되고], 일반 number로 보내도 된다
      return await this.service.getDeliveryAgencies({
        where: {
          deliveryLocations,
        },
      });
    },
  })
);
