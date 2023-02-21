"use strict";

const business = require("../controllers/business");

/**
 * business service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::business.business", ({ strapi }) => ({
  async test({ businessInfo, user }) {
    /** 요청계정에서 이미 가지고 있는 비즈니스가 있는지 체크 한다. */
    const business = await strapi.db.query("api::business.business").findOne({
      where: {
        user: user.id,
      },
    });
    if (business) {
      return {
        message: "이미 해당 계정에 등록된 비즈니스가 존재합니다",
      };
    }
    /** 똑같은 사업자등록번호를 가진 비즈니스가 DB에 존재하는지 체크한다. */
    const sameNumberBusiness = await strapi.db
      .query("api::business.business")
      .findOne({
        where: {
          number: businessInfo.number,
        },
      });
    if (sameNumberBusiness) {
      return {
        message: "배추요에 이미 똑같은 사업자 번호로 등록된 사업이 있습니다",
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
