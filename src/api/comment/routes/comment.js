"use strict";

/**
 * comment router
 */
module.exports = {
  routes: [
    {
      method: "GET",
      path: "/comment",
      handler: "comment.find",
    },
    {
      method: "POST",
      path: "/comment",
      handler: "comment.create",
    },
    {
      method: "PUT",
      path: "/comment/:id",
      handler: "comment.update",
      config: { policies: ["is-own"] },
    },
    {
      method: "DELETE",
      path: "/comment/:id",
      handler: "comment.delete",
      config: { policies: ["is-own"] },
    },
  ],
};
