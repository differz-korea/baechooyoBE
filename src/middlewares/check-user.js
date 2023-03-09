module.exports = (config, { strapi }) => {
  return async (context, next) => {
    console.log("회원가입시 과연 ");
    console.log(context.state);
    return await next();
  };
};
