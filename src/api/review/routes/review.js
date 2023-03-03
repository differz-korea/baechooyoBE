"use strict";

/**
 * review router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::review.review", {
  only: ["create", "delete", "find"],
  config: {
    //api/reviews?filters[deliveryAgency]=deliveryAgencyId
    find: {},
    create: {},
    delete: {},
  },
});
