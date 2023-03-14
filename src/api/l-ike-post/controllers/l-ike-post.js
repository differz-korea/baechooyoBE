"use strict";

/**
 * l-ike-post controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::l-ike-post.l-ike-post",
  ({ strapi }) => ({
    async likeOrUnLikePost(ctx) {
      const postId = ctx.params.id;
      const userId = ctx.state.user.id;

      const exsist = await strapi.db
        .query("api::l-ike-post.l-ike-post")
        .findOne({
          where: {
            post: postId,
            user: userId,
          },
        });
      if (exsist) {
        await strapi.db.query("api::l-ike-post.l-ike-post").delete({
          where: {
            post: postId,
            user: userId,
          },
        });
        return "좋아요 취소";
      }
      await strapi.db.query("api::l-ike-post.l-ike-post").create({
        data: {
          post: postId,
          user: userId,
        },
      });
      return "좋아요";
    },
    async getLikeInfo(ctx) {
      const postId = ctx.params.id;
      const userId = ctx.state.user.id;
      const likeCount = await strapi.db
        .query("api::l-ike-post.l-ike-post")
        .count({
          postId,
        });
      let isLiked = false;
      if (ctx.state.user) {
        const exsist = await strapi.db
          .query("api::l-ike-post.l-ike-post")
          .findOne({
            where: {
              post: postId,
              user: userId,
            },
          });
        if (exsist) {
          isLiked = true;
        }
      }
      return {
        likeCount,
        isLiked,
      };
    },
  })
);
