module.exports = (config, { strapi }) => {
  /** 요청한 유저의 business를 불러오는 미들웨어이다 */
  return async (context, next) => {
    const business = await strapi.db.query("api::business.business").findOne({
      where: {
        user: context.state.user.id,
      },
      populate: ["business_role"],
    });
    if (!business) {
      context.badRequest("고객님의 비즈니스 정보를 가지고 올 수 없습니다");
    }
    context.state.business = business;
    await next();
  };
};
