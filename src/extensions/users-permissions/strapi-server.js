("use strict");

module.exports = (plugin) => {
  plugin.routes["content-api"].routes = plugin.routes["content-api"].routes.map(
    (item) => {
      if (item.path == "/auth/local/register") {
        item.config.middlewares.push("global::check-user");
      }
      if (item.path == "/auth/local") {
        console.log(item);
        item.config.middlewares.push("global::test");
      }
      return item;
    }
  );
  return plugin;
};
