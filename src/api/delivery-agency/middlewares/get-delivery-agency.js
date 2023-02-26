module.exports = (config, { strapi }) => {
  /** 요청한 유저의 delivery-agency를 불러오는 미들웨어이다 */
  return async (context, next) => {
    const deliveryAgency = await strapi
      .service("api::delivery-agency.delivery-agency")
      .getDeliveryAgency({
        user: context.state.user.id,
      });
    if (!deliveryAgency) {
      return context.badRequest("고객님의 배달대행정보가 없습니다");
    }
    console.log(context.state.business.id);
    context.state.deliveryAgency = deliveryAgency;
    return await next();
  };
};
