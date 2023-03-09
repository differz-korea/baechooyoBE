("use strict");

module.exports = (plugin) => {
  plugin.routes["content-api"].routes = plugin.routes["content-api"].routes.map(
    (item) => {
      //sign up
      if (item.path == "/auth/local/register") {
        item.config.middlewares = [
          ...item.config.middlewares,
          "global::check-phone-number",
          "global::signup-check",
        ];
      }
      //sign in
      if (item.path == "/auth/local") {
        console.log(item);
        item.config.middlewares = [
          ...item.config.middlewares,
          "global::signin-check",
        ];
      }
      return item;
    }
  );
  return plugin;
};
