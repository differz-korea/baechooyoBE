"use strict";

/**
 * post router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::post.post", {
  config: {
    find: {},
    findOne: {
      middlewares: ["api::post.click-count"],
    },
    create: {},
    update: {
      policies: ["is-own"],
    },
    delete: {
      policies: ["is-own"],
    },
  },
});
