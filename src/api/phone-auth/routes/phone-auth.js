"use strict";

/**
 * phone-auth router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/phone-auth/sendKey",
      handler: "phone-auth.sendKey",
    },
    {
      method: "POST",
      path: "/phone-auth/authenticateKey",
      handler: "phone-auth.authenticateKey",
    },
  ],
};
