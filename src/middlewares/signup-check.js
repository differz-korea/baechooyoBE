const {
  BusinessType,
} = require("../extensions/users-permissions/type/business-type");

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.request.body.businessType === BusinessType.MERCHANT) {
      delete ctx.request.body.deliveryBrand;
    }
    return await next();
  };
};
