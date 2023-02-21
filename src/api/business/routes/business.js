"use strict";

/**
 * business router
 */

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/business",
      handler: "business.register",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
