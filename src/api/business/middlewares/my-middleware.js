module.exports = (config, { strapi }) => {
  return (context, next) => {
    console.log("gg");
    next("good");
  };
};
