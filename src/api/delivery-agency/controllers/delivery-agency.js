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
        business: ctx.state.business,
      });
    },
    async delete(ctx) {
      const deliveryAgencyId = ctx.state.deliveryAgency.id;
      return this.service.delete(deliveryAgencyId);
    },
    async getById(ctx) {
      const deliveryAgencyId = ctx.params.id;
      return await this.service.getDeliveryAgencyById(deliveryAgencyId);
    },
    async getMy(ctx) {
      return ctx.state.deliveryAgency;
    },
    async getByLocation(ctx) {},
    async getSomeDeliveryAgencyForMainPage(ctx) {},
  })
);
