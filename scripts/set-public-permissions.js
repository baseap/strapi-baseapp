'use strict';

/**
 * Enables `find`/`findOne` permissions on the Public role for the heritage
 * marketplace collections (Strapi Fix 2 — see documentation/PHASE5_TRAVEL_REDESIGN.md
 * and documentation/LAUNCHPAD_APINTEL_STRAPI_FIXES.md).
 *
 * Safe to re-run: skips any permission that's already granted instead of
 * creating duplicates.
 *
 * Usage:
 *   node scripts/set-public-permissions.js
 */

const READ_ONLY_COLLECTIONS = {
  'premium-category': ['find', 'findOne'],
  'premium-content': ['find', 'findOne'],
  'training-category': ['find', 'findOne'],
  'training-track': ['find', 'findOne'],
  'training-module': ['find', 'findOne'],
  'training-session': ['find', 'findOne'],
  'training-partner': ['find', 'findOne'],
  'pedagogy-type': ['find', 'findOne'],
  instructor: ['find', 'findOne'],
  vendor: ['find', 'findOne'],
  'content-creator': ['find', 'findOne'],
  tag: ['find', 'findOne'],
};

async function setPublicPermissions(newPermissions) {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) {
    throw new Error('Public role not found — is the users-permissions plugin installed?');
  }

  const created = [];
  const skipped = [];

  for (const [controller, actions] of Object.entries(newPermissions)) {
    for (const action of actions) {
      const actionId = `api::${controller}.${controller}.${action}`;

      const existing = await strapi.query('plugin::users-permissions.permission').findOne({
        where: { action: actionId, role: publicRole.id },
      });

      if (existing) {
        skipped.push(actionId);
        continue;
      }

      await strapi.query('plugin::users-permissions.permission').create({
        data: { action: actionId, role: publicRole.id },
      });
      created.push(actionId);
    }
  }

  return { created, skipped };
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  const { created, skipped } = await setPublicPermissions(READ_ONLY_COLLECTIONS);

  console.log(`Created ${created.length} permission(s):`);
  created.forEach((a) => console.log(`  + ${a}`));
  console.log(`Skipped ${skipped.length} already-existing permission(s):`);
  skipped.forEach((a) => console.log(`  = ${a}`));

  await app.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
