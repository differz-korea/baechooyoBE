"use strict";

/**
 * comment controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::comment.comment", ({ strapi }) => ({
  async create(ctx) {
    return await strapi.entityService.create("api::comment.comment", {
      data: {
        ...ctx.request.body,
        writer: ctx.state.user.id,
      },
    });
  },
  async find(ctx) {
    const postId = ctx.query.post;
    const data = await strapi.db.query("api::comment.comment").findMany({
      where: {
        post: postId,
      },
      populate: {
        writer: {
          select: ["businessName", "id"],
        },
      },
      orderBy: {
        createdAt: "DESC",
      },
    });
    console.log(data);
    return data;
  },
  // async delete(ctx) {
  //   const commentId = ctx.params.id;
  //   return await strapi.db.query("api::comment.comment").delete({
  //     where: {
  //       id: commentId,
  //     },
  //   });
  // },
}));
