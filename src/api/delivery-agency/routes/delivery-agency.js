"use strict";
/**
 * delivery-agency router
 */

module.exports = {
  routes: [
    {
      method: "POST",
      /** 자신계정의 비즈니스 정보에 있는 자신의 배달대행 정보를 등록 및 수정 하는 라우트 */
      path: "/delivery-agency",
      handler: "delivery-agency.registerOrEdit",
      config: {
        policies: [
          {
            name: "global::business-type-check",
            config: {
              businessType: "delivery",
            },
          },
        ],
        middlewares: ["api::business.get-business"],
      },
    },
    {
      /** 자신계정의 비즈니스 정보에 있는 자신의 배달대행 정보를 삭제하는 라우트 */
      method: "DELETE",
      path: "/delivery-agency",
      handler: "delivery-agency.delete",
      config: {
        middlewares: [
          "api::business.get-business",
          "api::delivery-agency.get-delivery-agency",
        ],
      },
    },
    {
      method: "GET",
      path: "/delivery-agency",
      handler: "delivery-agency.getMy",
      config: {
        middlewares: [
          "api::business.get-business",
          "api::delivery-agency.get-delivery-agency",
        ],
      },
    },
    {
      method: "GET",
      path: "/delivery-agency/:id",
      handler: "delivery-agency.getById",
    },
  ],
};
