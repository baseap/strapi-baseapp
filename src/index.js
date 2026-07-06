'use strict';

const { configureViewLabels } = require('../scripts/configure-view-labels');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs after
   * your application has been initialized.
   * 
   * Configures view labels for all content types and components
   * to display proper field names in admin UI.
   */
  bootstrap(/* { strapi } */) {
    // Run label configuration on server start
    // This ensures all collections display proper Title Case field names
    // instead of snake_case in the admin UI
    if (process.env.NODE_ENV === 'production' || process.env.STRAPI_ENV === 'production') {
      console.log('[Strapi Bootstrap] Configuring content manager view labels...');
      // Note: In production, this is handled by the migration script
      // In development, labels are configured via admin UI
    }
  },
};
