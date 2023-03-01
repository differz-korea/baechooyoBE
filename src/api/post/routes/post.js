"use strict";

/**
 * post router
 */
// 자유게시판, 지점장게시판, QNA와 같은 일반적인 글들을 담당하는 라우터입니다 :)
module.exports = {
  routes: [
    {
      method: "GET",
      path: "/post",
      handler: "post.find",
      //query로 post type을 분류해서 요청
    },
    {
      method: "GET",
      path: "/post/:id",
      handler: "post.findOne",
    },
    {
      method: "POST",
      path: "/post",
      handler: "post.create",
    },
    {
      method: "PUT",
      path: "/post/:id",
      handler: "post.update",
      config: { policies: ["is-own"] },
    },
    {
      method: "DELETE",
      path: "/post/:id",
      handler: "post.delete",
      config: { policies: ["is-own"] },
    },
  ],
};
