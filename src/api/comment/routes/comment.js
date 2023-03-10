"use strict";

/**
 * comment router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::comment.comment", {
  except: ["update"],
  only: ["find", "create", "delete"],
  config: {
    find: {},
    create: {},
    delete: {
      policies: ["is-own"],
    },
  },
});
