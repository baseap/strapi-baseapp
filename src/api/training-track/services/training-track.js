'use strict';

/**
 * training-track service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::training-track.training-track');
