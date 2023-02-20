module.exports = (policyContext, config, { strapi }) => {
  console.log(config);
  return true;
  //   if (policyContext.state.user) {
  //     // if user's role is the same as the one described in configuration
  //     return true;
  //   }
  //   return false; // If you return nothing, Strapi considers you didn't want to block the request and will let it pass
};
