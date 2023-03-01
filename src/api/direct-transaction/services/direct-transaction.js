'use strict';

/**
 * direct-transaction service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::direct-transaction.direct-transaction');
