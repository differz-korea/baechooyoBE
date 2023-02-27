"use strict";

/**
 * contract controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::contract.contract",
  ({ strapi }) => ({
    /** 계약서를 작성하는 핸들러 */
    async create(ctx) {},
    async getById(ctx) {},
    async getMyList(ctx) {},
    async response(ctx) {},
    async cancel(ctx) {},
    async edit(ctx) {},
  })
);
