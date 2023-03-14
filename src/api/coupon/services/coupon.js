"use strict";

/**
 * coupon service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::coupon.coupon", ({ strapi }) => ({
  async useCoupon(couponId, userId) {
    const coupon = await strapi.db.query("api::coupon-box.coupon-box").update({
      data: {
        isUsed: true,
      },
      where: {
        coupon: couponId,
        user: userId,
        isUsed: false,
      },
    });
  },
}));
