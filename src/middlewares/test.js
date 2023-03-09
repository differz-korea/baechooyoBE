const utils = require("@strapi/utils");
const { ApplicationError } = utils.errors;

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    console.log("로그인시 과연 ");
    const userNameOrEmail = ctx.request.body.identifier;
    const entry = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          $or: [{ email: userNameOrEmail }, { username: userNameOrEmail }],
        },
      });
    if (!entry) {
      ApplicationError("없는 유저");
    }
    if (!ctx.request.body.businessType) {
      ApplicationError(
        "어떤 비즈니스타입의 유저로 로그인할지 businessType을 보내주세요"
      );
    }
    console.log(entry.businessType, ctx.request.body.businessType);
    if (entry.businessType !== ctx.request.body.businessType) {
      ApplicationError("올바른 비즈니스 타입으로 로그인해주세요");
    }

    return await next();
  };
};
