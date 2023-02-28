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
      // 먼저 해당 하는 배달업체와의 계약 중 status가 approved또는 null로 되어있는것이 하나도 있으면 안된다.
      // 계약서를 작성한다.
      // details, description, deliveryAgency, expirationDate
      const { details, description, deliveryAgency, expirationDate } =
        ctx.request.body;
      const requesterId = ctx.state.user.id;
      const existContract = await strapi
        .service("api::contract.contract")
        .getContract({
          filter: {
            requester: requesterId,
            deliveryAgency,
            $or: [
              {
                // 계약이 성립되었거나
                status: "approved",
              },
              {
                // 계약이 승인을 기다리고있으면
                status: null,
              },
            ],
            //만료일자가 최신인것으로
            orderBy: [{ expirationDate: "desc" }],
          },
        });
      // 만약 계약이 존재한다면, 계약이 진행중인지 확인한다. - 만료시 새로 생성 허용
      if (new Date(existContract.expirationDate) > new Date()) {
        return {
          message:
            "이미 해당 업체와의 진행중 계약이 있기 때문에 계약서를 생성 할 수 없습니다",
        };
        // 이미 계약이 성립된 경우 사용자는 계약을 취소하고 나서, 계약서 status가 canceled 된 후에 새로 요청 할 수 있다.
        // 계약이 대기중인 경우 사용자는 계약을 수정하는 방법을 사용 할 수 있다.
      }
      const deliveryAgencyInfo = await strapi.entityService.findOne(
        "api::delivery-agency.delivery-agency",
        deliveryAgency,
        {
          // 배달 대행업체 사업자를 불러온다.
          populate: ["user"],
        }
      );
      return await strapi.service("api::contract.contract").create({
        data: {
          details,
          description,
          deliveryAgency,
          requester: requesterId,
          responder: deliveryAgencyInfo.user.id,
          expirationDate,
        },
      });
    },
    async getById(ctx) {
      const contractId = ctx.request.params.id;
      const userId = ctx.state.user.id;
      return await strapi.entityService.findOne(
        "api::contract.contract",
        contractId,
        {
          filter: {
            $or: [
              {
                requester: userId,
              },
              {
                responder: userId,
              },
            ],
          },
          populate: ["requester", "responder", "deliveryAgency"],
        }
      );
    },
    async getMyList(ctx) {
      const userId = ctx.state.user.id;
      return await strapi.service("api::contract.contract").getContracts({
        filter: {
          $or: [
            {
              requester: userId,
            },
            {
              responder: userId,
            },
          ],
        },
        populate: ["requester", "responder"],
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
    },
    async response(ctx) {
      const contractId = ctx.params.id;
      // body로 계약 승인 여부를 true 또는 false로 받는다
      const { approve } = ctx.request.body;
      const contractInfo = strapi.entityService.findOne(
        "api::contract.contract",
        contractId,
        { populate: ["requester", "responder"] }
      );
      // 먼저 계약서의 status가 null이라면 패스
      if (contractInfo.status !== null) {
        return {
          message: "계약상태가 계약중 상태가 아닙니다.",
        };
      }
      // 두 번째로 계약서의 responder가 현재 유저와 일치해야한다
      if (contractInfo.requester.id !== ctx.state.user.id) {
        return {
          message: "회원님이 응답할 수 있는 계약이 아닙니다",
        };
      }
      // 마지막으로 계약서의 status를 Approved 또는 Rejected로 결정한다
      await strapi.entityService.update("api::contract.contract", contractId, {
        status: approve ? "approved" : "rejected",
      });
      return;
    },
    async cancel(ctx) {
      const contractId = ctx.params.id;
      const contractInfo = await strapi.entityService.findOne(
        "api::contract.contract",
        contractId,
        {
          filter: {
            $or: [
              {
                requester: userId,
              },
              {
                responder: userId,
              },
            ],
          },
        }
      );
      if (contractInfo.requesterCancel && contractInfo.responderCancel) {
        await strapi.entityService.update(
          "api::contract.contract",
          contractId,
          {
            status: "canceled",
          }
        );
        return;
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
      await strapi.entityService.update("api::contract.contract", contractId, {
        ...cancelObj[ctx.state.user.businessType],
      });
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
      if (contract.status !== null) {
        return "계약이 이미 응답되었습니다 - 계약 취소 후 시도할 수 있습니다";
      }
      const { details, description, deliveryAgency, expirationDate } =
        ctx.request.body;
      return await strapi.entityService.update(
        "api::contract.contract",
        contractId,
        {
          data: {
            details,
            description,
            deliveryAgency,
            expirationDate,
          },
        }
      );
    },
  })
);
