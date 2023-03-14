"use strict";

const {
  BusinessType,
} = require("../../../extensions/users-permissions/type/business-type");

/**
 * contract controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::contract.contract",
  ({ strapi }) => ({
    /** 계약서를 작성하는 핸들러 */
    async create(ctx) {
      const requester = ctx.state.user.id;
      const { deliveryAgency, couponId } = ctx.request.body;
      // 사용자가 해당업체와 계약을 할 수 있는지 체크한다.
      await strapi
        .service("api::contract.contract")
        .canCreateContract(requester, deliveryAgency);
      const deliveryAgencyInfo = await strapi.entityService.findOne(
        "api::delivery-agency.delivery-agency",
        deliveryAgency,
        {
          // 배달 대행업체 사업자를 불러온다.
          populate: ["user"],
        }
      );
      //쿠폰을 사용한다.
      if (couponId != null) {
        await strapi
          .service("api::coupon.coupon")
          .useCoupon(couponId, ctx.state.user.id);
      }

      return await strapi.service("api::contract.contract").create({
        data: {
          ...ctx.request.body,
          deliveryAgency,
          status: "wating",
          requester,
          responder: deliveryAgencyInfo.user.id,
        },
      });
    },
    async getById(ctx) {
      const contractId = ctx.request.params.id;
      const contractInfo = await strapi.entityService.findOne(
        "api::contract.contract",
        contractId,
        {
          populate: {
            requester: {
              select: ["phoneNumber", "name", "businessId", "businessName"],
            },
            responder: {
              select: ["phoneNumber", "name", "businessId", "businessName"],
            },
          },
        }
      );
      await strapi
        .service("api::contract.contract")
        .canActivateContract(contractInfo, ctx.state.user);

      return contractInfo;
    },

    async getMyList(ctx) {
      const userId = ctx.state.user.id;
      const approved = await strapi
        .service("api::contract.contract")
        .contractsConditionByUserId(userId, "approved", false);
      const wating = await strapi
        .service("api::contract.contract")
        .contractsConditionByUserId(userId, "wating", false);
      const canceled = await strapi
        .service("api::contract.contract")
        .contractsConditionByUserId(userId, "canceled", false);
      const rejected = await strapi
        .service("api::contract.contract")
        .contractsConditionByUserId(userId, "rejected", false);
      const expired = await strapi
        .service("api::contract.contract")
        .contractsConditionByUserId(userId, null, true);

      return {
        approved,
        wating,
        canceled,
        rejected,
        expired,
      };
    },
    async response(ctx) {
      // 계약 승인 여부를 true 또는 false로 받는다
      const { approve, contractId } = ctx.request.body;
      const contractInfo = await strapi.entityService.findOne(
        "api::contract.contract",
        contractId,
        { populate: ["requester", "responder"] }
      );
      // 첫 번째로 계약서의 responder가 현재 유저와 일치해야한다
      await strapi
        .service("api::contract.contract")
        .canActivateContract(contractInfo, ctx.state.user);

      await strapi.service("api::contract.contract").canResponse(contractInfo);
      // 마지막으로 계약서의 status를 Approved 또는 Rejected로 결정한다
      await strapi.entityService.update("api::contract.contract", contractId, {
        data: {
          status: approve ? "approved" : "rejected",
          statusAt: new Date(),
        },
      });
      return {};
    },
    async cancel(ctx) {
      const { contractId } = ctx.request.body;
      const contractInfo = await strapi.entityService.findOne(
        "api::contract.contract",
        contractId
      );
      await strapi
        .service("api::contract.contract")
        .canActivateContract(contractInfo, ctx.state.user);

      //can Cancel ?
      if (contractInfo.status !== "approved") {
        return ctx.badRequest("취소하려면 approved 상태이여야 합니다!");
      }

      if (contractInfo.requesterCancel && contractInfo.responderCancel) {
        await strapi.entityService.update(
          "api::contract.contract",
          contractId,
          {
            status: "canceled",
            statusAt: new Date(),
          }
        );
        return {};
        // 이것은 소상공인과 배달대행 모두가 취소의사가 있어야 state를 cancel로 바꿀 수 있다.
      }
      const cancelObj = {
        [BusinessType.MERCHANT]: {
          requesterCancel: true,
        },
        [BusinessType.DELIVERY]: {
          responderCancel: true,
        },
      };
      await strapi.entityService.update(
        "api::contract.contract",
        contractId,
        cancelObj[ctx.state.user.businessType]
      );
      return;
    },
    async edit(ctx) {
      const contractId = ctx.request.params.id;
      const userId = ctx.state.userId;
      const contract = await strapi.entityService.findOne(
        "api::contract.contract",
        contractId,
        {
          filter: {
            requester: userId,
          },
        }
      );
      await strapi
        .service("api::contract.contract")
        .canActivateContract(contract, ctx.state.user);

      //can Edit?
      if (contract.status !== "wating") {
        return ctx.badRequest(
          "이미 배달대행사업자로부터 응답된 계약입니다, 계약을 수정하고싶으시면 현재 계약을 취소하고 새로운 계약서를 만드세요"
        );
      }

      await strapi.entityService.update("api::contract.contract", contractId, {
        data: ctx.request.body,
      });
      return {};
    },
  })
);
