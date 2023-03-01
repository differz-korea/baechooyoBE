module.exports = (policyContext, config, { strapi }) => {
  const { PolicyError } = require("@strapi/utils").errors;

  let populate = [...config.populate].filter((element) => element !== "writer");

  const postInfo = strapi.entityService.findOne(
    "api::post.post",
    policyContext.params.id,
    {
      populate: ["writer", ...populate],
    }
  );
  if (postInfo.writer.id !== policyContext.state.user.id) {
    throw new PolicyError(`회원님의 글이 아닙니다!`);
  }
  policyContext.state.post = postInfo;
  return true;
};
