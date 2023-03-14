"use strict";

/**
 * contract service
 */

const { createCoreService } = require("@strapi/strapi").factories;
const { ApplicationError, PolicyError } = require("@strapi/utils").errors;
const {
  BusinessType,
} = require("../../../extensions/users-permissions/type/business-type");

module.exports = createCoreService("api::contract.contract", ({ strapi }) => ({
  async getContract(condition) {
    const contractRepository = strapi.db.query("api::contract.contract");
    return await contractRepository.findOne(condition);
  },
  async getContracts(condition) {
    const contractRepository = strapi.db.query("api::contract.contract");
    return await contractRepository.findMany(condition);
  },

  // 업체와 계약을 할 수 있는 관계인지 체크한다.
  async canCreateContract(requesterId, deliveryAgencyId) {
    //1.  deliveryAgency 업체가 사용자와 계약중인 관계인지 확인한다.
    //2. deliveryAgency 업체에게 이미 요청해서 대기중인 계약이 있는지 확인한다.
    const existContract = await this.getContract({
      where: {
        requester: requesterId,
        deliveryAgency: deliveryAgencyId,
        $or: [
          {
            // 성립되었거나
            status: "approved",
          },
          {
            // 업체에게 응답 대기중인것
            status: "wating",
          },
        ],
      },
      orderBy: { expirationDate: "desc" },
    });
    if (!existContract) {
      return true;
    }
    if (existContract.status === "approved") {
      if (new Date(existContract.expirationDate) > new Date()) {
        throw new ApplicationError(
          "이미 해당 업체에게 승인되어 현재 진행중인 계약이 있습니다"
        );
      }
      //계약이 만료되면 새 계약서 생성을 허용한다.
    }
    if (existContract.status === "wating") {
      throw new ApplicationError(
        "이미 응답 대기중인 계약이 있습니다, 배달대행업체 응답전에는 계약서를 수정할 수 있습니다"
      );
    }
    return true;
  },
  //해당 계약서에 응답할 수 있는 상태인지 체크한다.
  async canResponse(contractInfo) {
    // 두 번째로 계약서의 status가 "wating"이여야한다.
    if (contractInfo.status !== "wating") {
      throw new ApplicationError("응답 대기중인 계약이 아닙니다.");
    }
    if (new Date(contractInfo.expirationDate) < new Date()) {
      throw new ApplicationError(
        "만료기한이 오늘을 지나간 계약서입니다!, 소상공인 사업자에게 계약서 수정을 문의하세요"
      );
    }
  },
  async canCreateReview(userId, deliveryAgencyId) {
    const isApprovedContract = await this.getContract({
      where: {
        requester: userId,
        deliveryAgency: deliveryAgencyId,
        status: "approved",
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    if (!isApprovedContract) {
      throw new ApplicationError(
        "이 업체에게 승인 응답을 받은 계약이 없습니다"
      );
    }
    let comparedDate = new Date();
    comparedDate.setDate(comparedDate.getDate() + 7);
    //오늘로 부터 7일 지난 날과 비교
    let approvedDate = new Date(isApprovedContract.statusAt);
    if (comparedDate > approvedDate) {
      throw new ApplicationError("업체 계약 승인일로부터 7일이 지나야합니다!");
    }
    return true;
  },
  //계약 API에 대한 접근 권한이 있는지 체크한다.
  async canActivateContract(contract, user) {
    if (user.businessType === BusinessType.DELIVERY) {
      if (contract.responder.id === user.id) {
        return;
      }
    }
    if (user.businessType === BusinessType.MERCHANT) {
      if (contract.requester.id === user.id) {
        return;
      }
    }
    throw new PolicyError("고객님이 접근 할 수 없는 계약입니다!");
  },

  //한 배달대행 업체의 계약상태를 반환한다.
  // 배달대행 업체 기준으로
  // status에 null을 보내면, approved, rejected, canceled, waiting을 포함한 모든 계약을 반환 받을 수 있고
  // status에 approved 또는 rejected 또는 canceled 또는 wating을 보내면 각각 해당하는 계약을 반환 받을 수 있고
  // atExpired에 true를 보내면 보내진 status와 함께 만료된 계약들이 반환된다.
  async contractsCondition(deliveryAgencyId, status, atExpired = false) {
    const contractRepository = strapi.db.query("api::contract.contract");

    const where = {
      deliveryAgency: deliveryAgencyId,
      status,
    };

    if (!status) {
      delete where.status;
    }

    if (atExpired) {
      where.expirationDate = {
        $gt: new Date().toISOString().slice(0, 10),
      };
    }

    const [data, count] = await contractRepository.findWithCount({
      where,
      orderBy: {
        createdAt: "desc",
      },
      populate: {
        requester: {
          select: ["phoneNumber", "name", "businessName"],
        },
        responder: {
          select: ["phoneNumber", "name", "businessName"],
        },
      },
    });
    return {
      data,
      count,
    };
  },

  // 유저아이디를 기준으로
  // status에 null을 보내면, approved, rejected, canceled, waiting을 포함한 모든 계약을 반환 받을 수 있고
  // status에 approved 또는 rejected 또는 canceled 또는 wating을 보내면 각각 해당하는 계약을 반환 받을 수 있고
  // atExpired에 true를 보내면 보내진 status와 함께 만료된 계약들이 반환된다.
  async contractsConditionByUserId(userId, status, atExpired = false) {
    const contractRepository = strapi.db.query("api::contract.contract");
    const where = {
      $or: [
        {
          requester: userId,
        },
        {
          responder: userId,
        },
      ],
      status,
    };

    if (!status) {
      delete where.status;
    }

    if (atExpired) {
      where.expirationDate = {
        $lt: new Date().toISOString().slice(0, 10),
      };
    }
    const [data, count] = await contractRepository.findWithCount({
      where,
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      populate: {
        requester: {
          select: ["phoneNumber", "name", "businessId", "businessName"],
        },
        responder: {
          select: ["phoneNumber", "name", "businessId", "businessName"],
        },
      },
    });
    return {
      data,
      count,
    };
  },
}));
