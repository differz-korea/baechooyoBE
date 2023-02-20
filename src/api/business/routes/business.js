"use strict";

/**
 * business router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::business.business", {
  only: ["create", "findOne", "find"],
  config: {
    create: {
      //   auth: true,
      policies: [],
      middlewares: [],
    },
    findOne: {},
  },
});
