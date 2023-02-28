"use strict";

/**
 * review router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/review",
      handler: "review.create",
    },
    {
      method: "DELETE",
      path: "/review/:id",
      handler: "review.delete",
    },
  ],
};
