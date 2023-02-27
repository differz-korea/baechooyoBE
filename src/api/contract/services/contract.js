"use strict";

/**
 * contract service
 */

const { createCoreService } = require("@strapi/strapi").factories;

const strapi = require("@strapi/strapi");

module.exports = createCoreService("api::contract.contract", ({ strapi }) => ({
  async getContract(condition) {},
  async getContractList(condition) {},
  async editContract(condition, data) {},
  async createContract(data) {
    return await strapi.entityService.create(
      "api::delivery-agency.delivery-agency",
      {
        data,
      }
    );
  },
}));
