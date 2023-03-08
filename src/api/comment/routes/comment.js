"use strict";

/**
 * comment router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::comment.comment", {
  except: ["update"],
  only: ["find", "create", "delete"],
  config: {
    find: {
      // /api/comments?filters[post]=postId
      // postId를 통해 해당 post의 댓글들을 불러올 수 있다.
    },
    create: {},
    delete: {
      policies: ["is-own"],
    },
  },
});
