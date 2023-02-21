"use strict";

/**
 * delivery-agency controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::delivery-agency.delivery-agency",
  ({ strapi }) => ({
    async register(ctx) {
      //ctx에서 미들웨어를 통해 유저의 비즈니스를 불러와야한다.
      return await strapi
        .service("api::delivery-agency.delivery-agency")
        .register({
          deliveryAgencyInfo: ctx.request.body,
          business: ctx.state.business,
        });
    },
    async edit(ctx) {},
    async delete(ctx) {},
  })
);
