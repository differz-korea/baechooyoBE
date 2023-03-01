"use strict";

/**
 * post router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

// 자유게시판, 지점장게시판, QNA와 같은 일반적인 글들을 담당하는 라우터입니다 :)
module.exports = createCoreRouter("api::post.post", {
  except: [],
  config: {
    //로그인 시 이용가능
    create: {
      config: {
        auth: true,
      },
      policies: [],
      middlewares: [],
    },
    //페이지네이션 기본 제공, type[자유게시판, 지점장게시판, QNA]등을 구분해서 요청
    find: {},
    // populate comments 필요!
    findOne: {},
    //수정기능, 삭제기능은 커스텀이 필요
    update: {
      //글이 자신의 글이어야한다.
      policies: ["is-own"],
      middlewares: [],
    },
    delete: {
      //글이 자신의 글이어야한다.
      policies: ["is-own"],
      middlewares: [],
    },
  },
});
