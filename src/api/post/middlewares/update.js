const { createReadStream } = require("fs");
const { resolve } = require("path");

module.exports = (config, { strapi }) => {
  /** 게시글 수정시 */
  return async (context, next) => {
    if (context.request.body.type === "job") {
      const { id } = await strapi.db.query("api::job.job").update({
        data: context.request.body,
        where: {
          post: context.params.id,
        },
      });
    }
    if (context.request.body.type === "direct-transaction") {
      const { productName, productPrice, transactionLocation, productExplain } =
        context.request.body;
      await strapi.db
        .query("api::direct-transaction.direct-transaction")
        .update({
          data: {
            productName,
            productPrice,
            transactionLocation,
            productExplain,
          },
          where: {
            post: context.params.id,
          },
        });
    }
    return await next();
  };
};
