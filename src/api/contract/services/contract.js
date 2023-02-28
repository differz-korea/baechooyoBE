"use strict";

/**
 * contract service
 */

const { createCoreService } = require("@strapi/strapi").factories;

const strapi = require("@strapi/strapi");

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
}));
