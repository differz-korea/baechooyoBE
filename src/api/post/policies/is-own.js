module.exports = async (policyContext, config, { strapi }) => {
  const { PolicyError } = require("@strapi/utils").errors;

  const postInfo = await strapi.entityService.findOne(
    "api::post.post",
    policyContext.params.id,
    {
      populate: ["writer"],
    }
  );

  if (!postInfo || postInfo.writer.id !== policyContext.state.user.id) {
    throw new PolicyError(`회원님의 글이 아니거나 존재하지 않는 게시글입니다!`);
  }
  policyContext.state.post = postInfo;
  return true;
};
