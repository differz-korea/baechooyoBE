"use strict";

/**
 * delivery-agency router
 */

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/delivery-agency",
      handler: "delivery-agency.register",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/delivery-agency",
      handler: "delivery-agency.edit",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/delivery-agency",
      handler: "delivery-agency.delete",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
