#!/usr/bin/env node

/**
 * apply-view-labels.js
 * 
 * Applies "Configure the View" labels to all content types and components
 * in the Strapi database directly.
 * 
 * This script modifies the core_store table to set proper field labels,
 * which override schema-level labels and control admin UI display.
 * 
 * Usage:
 *   node scripts/apply-view-labels.js
 *   or via npm script (after adding to package.json):
 *   npm run apply:labels
 * 
 * Run this after deployment to fix field name display (creator_type → Creator Type)
 */

const path = require('path');

async function applyViewLabels() {
  try {
    console.log('🔧 Starting Strapi view labels configuration...\n');

    // Bootstrap Strapi instance
    const strapiInstance = require(path.resolve(__dirname, '../node_modules/@strapi/core'));
    const Strapi = strapiInstance.Strapi;
    const strapi = new Strapi({
      appDir: path.resolve(__dirname, '..'),
      distDir: path.resolve(__dirname, '../dist'),
    });

    console.log('⏳ Loading Strapi instance...');
    await strapi.load();

    const settingKey = 'plugin_content_manager_configuration_content_types';

    // Define all field label configurations
    const configurations = {
      'api::premium-category.premium-category': {
        attributes: {
          name: { label: 'Name' },
          slug: { label: 'Slug' },
          description: { label: 'Description' },
          display_order: { label: 'Display Order' },
          is_active: { label: 'Is Active' },
        },
      },
      'api::training-category.training-category': {
        attributes: {
          name: { label: 'Name' },
          slug: { label: 'Slug' },
          what_it_covers: { label: 'What It Covers' },
          research_lineage: { label: 'Research Lineage' },
          display_order: { label: 'Display Order' },
          is_active: { label: 'Is Active' },
          parent_category: { label: 'Parent Category' },
        },
      },
      'api::training-partner.training-partner': {
        attributes: {
          organization_name: { label: 'Organization Name' },
          slug: { label: 'Slug' },
          organization_type: { label: 'Organization Type' },
          description: { label: 'Description' },
          logo: { label: 'Logo' },
          cover_image: { label: 'Cover Image' },
          contact_email: { label: 'Contact Email' },
          contact_phone: { label: 'Contact Phone' },
          website: { label: 'Website' },
          location: { label: 'Location' },
          accreditation: { label: 'Accreditation' },
          verified: { label: 'Verified' },
          is_active: { label: 'Is Active' },
        },
      },
      'api::instructor.instructor': {
        attributes: {
          name: { label: 'Name' },
          slug: { label: 'Slug' },
          title: { label: 'Title' },
          bio: { label: 'Bio' },
          avatar: { label: 'Avatar' },
          credentials: { label: 'Credentials' },
          specializations: { label: 'Specializations' },
          years_experience: { label: 'Years Experience' },
          contact_email: { label: 'Contact Email' },
          is_active: { label: 'Is Active' },
        },
      },
      'api::vendor.vendor': {
        attributes: {
          business_name: { label: 'Business Name' },
          slug: { label: 'Slug' },
          business_type: { label: 'Business Type' },
          description: { label: 'Description' },
          logo: { label: 'Logo' },
          cover_image: { label: 'Cover Image' },
          contact_email: { label: 'Contact Email' },
          contact_phone: { label: 'Contact Phone' },
          website: { label: 'Website' },
          location: { label: 'Location' },
          verified: { label: 'Verified' },
          training_status: { label: 'Training Status' },
          certification_date: { label: 'Certification Date' },
          is_active: { label: 'Is Active' },
        },
      },
      'api::content-creator.content-creator': {
        attributes: {
          name: { label: 'Name' },
          slug: { label: 'Slug' },
          creator_type: { label: 'Creator Type' },
          organization: { label: 'Organization' },
          role: { label: 'Role' },
          bio: { label: 'Bio' },
          avatar: { label: 'Avatar' },
          email: { label: 'Email' },
          is_active: { label: 'Is Active' },
        },
      },
      'api::premium-content.premium-content': {
        attributes: {
          title: { label: 'Title' },
          slug: { label: 'Slug' },
          description: { label: 'Description' },
          content: { label: 'Content' },
          cover_image: { label: 'Cover Image' },
          gallery: { label: 'Gallery' },
          duration_hours: { label: 'Duration Hours' },
          max_capacity: { label: 'Max Capacity' },
          difficulty_level: { label: 'Difficulty Level' },
          age_suitability: { label: 'Age Suitability' },
          language: { label: 'Language' },
          location: { label: 'Location' },
          pricing: { label: 'Pricing' },
          what_included: { label: 'What Included' },
          what_to_bring: { label: 'What To Bring' },
          faq: { label: 'FAQ' },
          seo_metadata: { label: 'SEO Metadata' },
          is_featured: { label: 'Is Featured' },
          is_active: { label: 'Is Active' },
        },
      },
      'api::training-track.training-track': {
        attributes: {
          title: { label: 'Title' },
          slug: { label: 'Slug' },
          description: { label: 'Description' },
          overview: { label: 'Overview' },
          cover_image: { label: 'Cover Image' },
          duration_hours: { label: 'Duration Hours' },
          difficulty_level: { label: 'Difficulty Level' },
          learning_objectives: { label: 'Learning Objectives' },
          max_capacity: { label: 'Max Capacity' },
          language: { label: 'Language' },
          location: { label: 'Location' },
          is_virtual: { label: 'Is Virtual' },
          pricing: { label: 'Pricing' },
          certificate_available: { label: 'Certificate Available' },
          applicable_launchpad_tracks: { label: 'Applicable Launchpad Tracks' },
          recommended_onboarding_stage: { label: 'Recommended Onboarding Stage' },
          required_certification_tier: { label: 'Required Certification Tier' },
          strapi_course_id: { label: 'Strapi Course ID' },
          vendor_prep_required: { label: 'Vendor Prep Required' },
          faq: { label: 'FAQ' },
          seo_metadata: { label: 'SEO Metadata' },
          is_featured: { label: 'Is Featured' },
          is_active: { label: 'Is Active' },
        },
      },
      'api::training-session.training-session': {
        attributes: {
          title: { label: 'Title' },
          slug: { label: 'Slug' },
          description: { label: 'Description' },
          content: { label: 'Content' },
          order: { label: 'Order' },
          duration_minutes: { label: 'Duration Minutes' },
          session_type: { label: 'Session Type' },
          materials: { label: 'Materials' },
          video_url: { label: 'Video URL' },
          is_active: { label: 'Is Active' },
        },
      },
      'api::tag.tag': {
        attributes: {
          name: { label: 'Name' },
          slug: { label: 'Slug' },
          tag_type: { label: 'Tag Type' },
          description: { label: 'Description' },
          is_active: { label: 'Is Active' },
        },
      },
    };

    console.log('📝 Applying labels to content types:\n');

    let successCount = 0;
    let errorCount = 0;

    // Apply configurations
    for (const [uid, config] of Object.entries(configurations)) {
      const storeKey = `${settingKey}::${uid}`;

      try {
        // Get existing settings if any
        const existing = await strapi.db.query('strapi_core_store').findOne({
          where: { key: storeKey },
        });

        if (existing) {
          const value = typeof existing.value === 'string' ? JSON.parse(existing.value) : existing.value;

          // Merge new attributes into existing config
          if (!value.attributes) {
            value.attributes = {};
          }

          value.attributes = {
            ...value.attributes,
            ...config.attributes,
          };

          await strapi.db.query('strapi_core_store').update({
            where: { key: storeKey },
            data: { value: JSON.stringify(value) },
          });

          console.log(`  ✅ Updated: ${uid}`);
        } else {
          // Create new configuration
          const newValue = {
            uid,
            settings: {
              bulkable: true,
              filterable: true,
              searchable: true,
              sortable: true,
              pageSize: 10,
            },
            layouts: {
              list: [],
              editRelations: [],
              edit: [],
            },
            ...config,
          };

          await strapi.db.query('strapi_core_store').create({
            data: {
              key: storeKey,
              value: JSON.stringify(newValue),
              type: 'object',
            },
          });

          console.log(`  ✅ Created: ${uid}`);
        }

        successCount++;
      } catch (error) {
        console.error(`  ❌ Error updating ${uid}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Results: ${successCount} successful, ${errorCount} errors\n`);

    if (errorCount === 0) {
      console.log('✨ All view labels applied successfully!');
      console.log('💾 Labels will take effect after admin UI refresh.');
      console.log('\n🔄 Refresh your browser to see changes:');
      console.log('   https://positive-acoustics-345fa51dc4.strapiapp.com/admin\n');
    } else {
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    console.error(error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the script
if (require.main === module) {
  applyViewLabels();
}

module.exports = { applyViewLabels };
