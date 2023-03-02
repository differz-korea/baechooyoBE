"use strict";

/**
 * post router
 */
// 자유게시판, 지점장게시판, QNA와 같은 일반적인 글 + 구인구직, 직거래 글들을 담당하는 라우터입니다 :)
module.exports = {
  routes: [
    {
      method: "GET",
      path: "/post",
      handler: "post.find",
    },
    {
      method: "GET",
      path: "/post/:id",
      config: {
        middlewares: ["api::post.click-count"],
      },
      handler: "post.findOne",
    },
    {
      method: "POST",
      path: "/post",
      handler: "post.create",
      //생성시,
      config: {
        middlewares: ["api::post.create"],
      },
    },
    {
      method: "PUT",
      path: "/post/:id",
      handler: "post.update",
      config: { policies: ["is-own"], middlewares: ["api::post.update"] },
    },
    {
      method: "DELETE",
      path: "/post/:id",
      handler: "post.delete",
      config: { policies: ["is-own"] },
    },
  ],
};
