module.exports = (config, { strapi }) => {
  /** business의 역할을 체크합니다 */
  return async (context, next) => {
    const userBusinessRoleName = context.state.business.business_role.name;
    if (userBusinessRoleName == config.roleName) {
      return await next();
    } else {
      return context.badRequest(
        `고객님의 비즈니스 역할이 ${config.roleName}역할과 맞지 않습니다`
      );
    }
  };
};
