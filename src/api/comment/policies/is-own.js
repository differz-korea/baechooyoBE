module.exports = async (policyContext, config, { strapi }) => {
  const { PolicyError } = require("@strapi/utils").errors;

  const commentInfo = await strapi.entityService.findOne(
    "api::comment.comment",
    policyContext.params.id,
    {
      populate: ["writer"],
    }
  );
  console.log(commentInfo);
  if (!commentInfo || commentInfo.writer.id !== policyContext.state.user.id) {
    throw new PolicyError(`회원님의 댓글이 아니거나 존재하지 않는 댓글입니다!`);
  }
  return true;
};
