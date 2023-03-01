'use strict';

/**
 * direct-transaction router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::direct-transaction.direct-transaction');
