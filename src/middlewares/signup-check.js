const {
  BusinessType,
} = require("../extensions/users-permissions/type/business-type");

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.request.body.businessType === BusinessType.MERCHANT) {
      delete ctx.request.body.deliveryBrand;
    }

    //추천인 포인트 기능을 구현할거면 여기서 하자!

    return await next();
  };
};
