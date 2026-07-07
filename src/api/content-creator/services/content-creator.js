'use strict';

/**
 * content-creator service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::content-creator.content-creator');
