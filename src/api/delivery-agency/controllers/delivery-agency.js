"use strict";

/**
 * delivery-agency controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::delivery-agency.delivery-agency",
  ({ strapi }) => ({
    service: strapi.service("api::delivery-agency.delivery-agency"),
    async registerOrEdit(ctx) {
      return await this.service.registerOrEdit({
        deliveryAgencyInfo: ctx.request.body,
        user: ctx.state.user,
      });
    },
    async getById(ctx) {
      const deliveryAgencyId = ctx.params.id;
      return await this.service.getDeliveryAgency({
        where: {
          id: deliveryAgencyId,
        },
      });
    },
    async getByUser(ctx) {
      return await this.service.getDeliveryAgency({
        where: {
          user: ctx.state.user.id,
        },
      });
    },
    async getForMain(ctx) {},
    async getByLocation(ctx) {},
  })
);
