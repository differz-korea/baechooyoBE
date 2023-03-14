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
          {
            name: "global::business-type-check",
            config: BusinessType.DELIVERY,
          },
        ],
      },
    },
    /** 배달대행아이디로 쿠폰정보를 불러온다. */
    {
      method: "GET",
      path: "/coupons-delivery-agency/:id",
      handler: "coupon.getCouponByDeliveryAgencyId",
    },
    /** 쿠폰아이디로 쿠폰을 다운로드한다. */
    {
      method: "POST",
      path: "/coupons/downloadCoupon/:id",
      handler: "coupon.downloadCoupon",
      config: {
        policies: [
          {
            name: "global::business-type-check",
            config: BusinessType.MERCHANT,
          },
        ],
      },
    },
    // {
    //   method: "POST",
    //   path: "/coupons",
    //   handler: "coupon.delete",
    // },
  ],
};
