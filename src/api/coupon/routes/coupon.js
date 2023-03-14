"use strict";

const {
  BusinessType,
} = require("../../../extensions/users-permissions/type/business-type");

/**
 * coupon router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;
module.exports = {
  routes: [
    {
      method: "POST",
      path: "/coupons",
      handler: "coupon.setCoupon",
      config: {
        policies: [
          /** 계정이 배달업체로 등록된 사용자만 등록 할 수 있다 */
          {
            name: "global::business-type-check",
            config: BusinessType.DELIVERY,
          },
        ],
      },
    },
    {
      method: "POST",
      path: "/coupons",
      handler: "coupon.delete",
    },
  ],
};
