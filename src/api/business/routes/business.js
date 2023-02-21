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
    {
      method: "PUT",
      path: "/business",
      handler: "business.edit",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/business",
      handler: "business.delete",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
