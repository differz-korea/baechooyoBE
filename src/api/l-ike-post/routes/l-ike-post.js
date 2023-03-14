"use strict";

/**
 * l-ike-post router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/like/:id",
      handler: "l-ike-post.likeOrUnLikePost",
    },
  ],
};
