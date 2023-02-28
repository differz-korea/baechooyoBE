"use strict";

/**
 * contract service
 */

const { createCoreService } = require("@strapi/strapi").factories;

const strapi = require("@strapi/strapi");
const {
  BusinessType,
} = require("../../../extensions/users-permissions/type/business-type");
const contract = require("../routes/contract");

module.exports = createCoreService("api::contract.contract", ({ strapi }) => ({
  async getContract(condition) {
    const contractRepository = strapi.db.query("api::contract.contract");
    return await contractRepository.findOne(condition);
  },
  async getContracts(condition) {
    const contractRepository = strapi.db.query("api::contract.contract");
    return await contractRepository.findMany(condition);
  },
  async createContract(data) {
    return await strapi.entityService.create(
      "api::delivery-agency.delivery-agency",
      {
        data,
      }
    );
  },
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
    const ctx = strapi.requestContext.get();
    return ctx.response.badRequest("고객님께서 접근 할 수 없는 계약입니다");
  },
}));
