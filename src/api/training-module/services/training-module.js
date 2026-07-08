'use strict';

/**
 * training-module service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::training-module.training-module');
