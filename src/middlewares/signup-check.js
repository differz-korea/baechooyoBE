const { default: axios } = require("axios");
const {
  BusinessType,
} = require("../extensions/users-permissions/type/business-type");

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.request.body.businessType === BusinessType.MERCHANT) {
      delete ctx.request.body.deliveryBrand;
    }

    //사업자 진위 확인
    const { businessId, startDate, name, businessName } = ctx.request.body;
    console.log(businessId, startDate, name, businessName);
    const { data } = await axios.post(
      "https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=Ej2%2BZXeAjR9NujeHJ4UEHtCSxYsT06aq%2BQyLuCqQsnWEb2pjQXF9imj8YGjRiLUSEGyB6xGfTdlcsezKQkgM5w%3D%3D",
      {
        businesses: [
          {
            b_no: businessId,
            start_dt: startDate,
            p_nm: name,
            b_nm: businessName,
          },
        ],
      }
    );
    console.log(data);
    if (!data.data[0].status) {
      return ctx.badRequest("사업자 진위 확인 과정에 실패하였습니다");
    }
    return await next();
  };
};
