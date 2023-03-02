const { createReadStream } = require("fs");
const { resolve } = require("path");

module.exports = (config, { strapi }) => {
  /** 게시글 추가시, . */
  return async (context, next) => {
    // 게시글 타입이 directTransaction, job 인 경우 해당 entity를 생성
    console.log(context.request.files);
    // await strapi.plugins.upload.services.upload.upload({
    //   files: context.request.files,
    // });
    if (context.request.body.type === "job") {
      const { location, salary, jobExplain } = context.request.body;
      const { id } = await strapi.entityService.create("api::job.job", {
        data: { location, salary, jobExplain },
        files: context.request.files,
      });
      context.request.body["job"] = id;
    }
    if (context.request.body.type === "direct-transaction") {
      const { productName, productPrice, transactionLocation, productExplain } =
        context.request.body;

      const { id } = await strapi.entityService.create(
        "api::direct-transaction.direct-transaction",
        {
          data: {
            productName,
            productPrice,
            transactionLocation,
            productExplain,
          },
        }
      );
      context.request.body["directTransaction"] = id;
    }
    return await next();
  };
};
