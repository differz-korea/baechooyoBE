module.exports = (config, { strapi }) => {
  /** 게시글의 조회수를 올려 업데이트 시키는 미들웨어이다. */
  return async (context, next) => {
    const postId = context.params.id;
    const postInfo = await strapi.db.query("api::post.post").findOne({
      where: {
        id: postId,
      },
    });
    const p = await strapi.db.query("api::post.post").update({
      data: {
        views: postInfo.views + 1,
      },
      where: {
        id: postId,
      },
    });
    console.log(p);
    return await next();
  };
};
