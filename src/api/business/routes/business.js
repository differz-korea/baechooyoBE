"use strict";

/**
 * business router
 */

// const getBusiness = require("../middlewares/getBusiness");

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/business",
      handler: "business.register",
      config: {
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/business",
      handler: "business.edit",
      config: {
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/business",
      handler: "business.delete",
      config: {
        middlewares: [],
      },
    },
  ],
};
