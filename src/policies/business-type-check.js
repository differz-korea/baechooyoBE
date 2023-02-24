module.exports = (policyContext, config = "DELIVERY", { strapi }) => {
  const { PolicyError } = require("@strapi/utils").errors;
  // DELIVERY - 배달대행
  // MERCHANT - 소상공인
  const BUSINESS_TYPE_KOREAN = {
    DELIVERY: "배달대행",
    MERCHANT: "소상공인",
  };
  if (policyContext.state.user.businessType === config) {
    return true;
  }
  throw new PolicyError(
    `회원님의 비즈니스 타입이 '${BUSINESS_TYPE_KOREAN[config]}' 타입이 아닙니다!`
  );
};
