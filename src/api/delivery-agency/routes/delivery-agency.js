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
        middlewares: [
          {
            name: "api::business.get-business",
          },
          {
            name: "api::business-role.check-business-role",
            config: {
              roleName: "delivery agency",
            },
          },
        ],
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
