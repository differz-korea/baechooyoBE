module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const { phoneNumber, key, businessType } = ctx.request.body;
    /** 휴대폰 인증 체크 부분 */
    if (!phoneNumber || !key) {
      return ctx.badRequest("휴대폰 인증키 보내주세요");
    }
    const isAuthenticated = await strapi
      .service("api::phone-auth.phone-auth")
      .checkAndUseKey(phoneNumber, key);
    if (!isAuthenticated) {
      return ctx.badRequest("휴대폰 인증키가 맞지 않거나 시간이 초과됨");
    }
    /** 휴대폰 인증 체크 부분 */

    return await next();
  };
};
