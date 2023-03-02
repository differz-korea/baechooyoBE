"use strict";

/**
 * post controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::post.post", ({ strapi }) => ({
  async create(ctx) {
    const postInfo = await strapi.entityService.create("api::post.post", {
      data: {
        ...ctx.request.body,
        writer: ctx.state.user.id,
      },
    });
    return "쓰기 완료!";
  },

  async findOne(ctx) {
    const postInfo = await strapi.entityService.findOne(
      "api::post.post",
      ctx.params.id,
      {
        populate: "*",
      }
    );
    Promise.all(
      (postInfo.files = postInfo.files.map((data) => {
        console.log(data);
        return data.url;
      }))
    );
    return postInfo;
  },
  async update(ctx) {
    const { title, content, type } = ctx.request.body;
    // 쓴 사용자 user 정보는 바꿀 수 없도록
    await strapi.entityService.update("api::post.post", ctx.params.id, {
      data: {
        title,
        content,
        type,
      },
    });
    return "업데이트 완료!";
  },
}));
