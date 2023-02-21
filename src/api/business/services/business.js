"use strict";

const business = require("../controllers/business");

/**
 * business service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::business.business", ({ strapi }) => ({
  async register({ businessInfo, user }) {
    /** 요청계정에서 이미 가지고 있는 비즈니스가 있는지 체크 한다. */
    /** 똑같은 사업자등록번호를 가진 비즈니스가 DB에 존재하는지 체크한다. */
    const business = await strapi.db.query("api::business.business").findOne({
      where: {
        $or: [{ user: user.id }, { number: businessInfo.number }],
      },
    });
    if (business) {
      return {
        message:
          "이미 고객님 또는 다른 계정에 비즈니스가 등록되어있기 때문에 이 등록을 진행 할 수 없습니다.",
      };
    }
    /** 등록 조건에 모두 해당한다면 그 후에 비즈니스를 생성한다. */
    const { number, name, location, business_role } = businessInfo;
    const registeredBusiness = await strapi.entityService.create(
      "api::business.business",
      { data: { number, name, location, business_role, user: user.id } }
    );
    return registeredBusiness;
  },
}));
