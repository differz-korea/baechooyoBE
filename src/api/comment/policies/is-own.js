const { PolicyError } = require("@strapi/utils").errors;

module.exports = async (policyContext, config, { strapi }) => {
  const commentInfo = await strapi.entityService.findOne(
    "api:comment.comment",
    policyContext.params.id,
    {
      populate: ["writer"],
    }
  );
  if (!commentInfo || commentInfo.writer.id !== policyContext.state.user.id) {
    throw new PolicyError(`회원님의 글이 아니거나 존재하지 않는 게시글입니다!`);
  }
  return true;
};
