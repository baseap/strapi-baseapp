'use strict';

/**
 * training-session service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::training-session.training-session');
