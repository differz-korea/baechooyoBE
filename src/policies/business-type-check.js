module.exports = (policyContext, config, { strapi }) => {
  const { PolicyError } = require("@strapi/utils").errors;
  if (policyContext.state.user.businessType === config.businessType) {
    return true;
  }
  throw new PolicyError(
    `회원님의 비즈니스 타입이 '${config.businessType}' 타입이 아닙니다!`
  );
};
