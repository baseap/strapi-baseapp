/**
 * Configure View Labels Migration Script
 * 
 * This script sets up "Configure the View" labels for all content types and components.
 * These labels override the schema-level labels and control how field names display in the admin UI.
 * 
 * Labels are stored in strapi_core_store table with keys like:
 * plugin_content_manager_configuration_content_types::api::premium-content.premium-content
 * 
 * Run: npm run strapi -- admin:create-api-token --name "migrate" 
 *      or
 *      npm run migrate:labels
 */

// Helper to convert snake_case to Title Case
function toTitleCase(str) {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Define all content types and their field label mappings
const labelConfigs = {
  // Premium Category
  'api::premium-category.premium-category': {
    displayName: 'Premium Category',
    fields: {
      name: 'Name',
      slug: 'Slug',
      description: 'Description',
      display_order: 'Display Order',
      is_active: 'Is Active',
    },
  },
  
  // Training Category
  'api::training-category.training-category': {
    displayName: 'Training Category',
    fields: {
      name: 'Name',
      slug: 'Slug',
      what_it_covers: 'What It Covers',
      research_lineage: 'Research Lineage',
      display_order: 'Display Order',
      is_active: 'Is Active',
      parent_category: 'Parent Category',
    },
  },
  
  // Training Partner
  'api::training-partner.training-partner': {
    displayName: 'Training Partner',
    fields: {
      organization_name: 'Organization Name',
      slug: 'Slug',
      organization_type: 'Organization Type',
      description: 'Description',
      logo: 'Logo',
      cover_image: 'Cover Image',
      contact_email: 'Contact Email',
      contact_phone: 'Contact Phone',
      website: 'Website',
      location: 'Location',
      accreditation: 'Accreditation',
      verified: 'Verified',
      is_active: 'Is Active',
      instructors: 'Instructors',
      training_tracks: 'Training Tracks',
    },
  },
  
  // Instructor
  'api::instructor.instructor': {
    displayName: 'Instructor',
    fields: {
      name: 'Name',
      slug: 'Slug',
      title: 'Title',
      bio: 'Bio',
      avatar: 'Avatar',
      credentials: 'Credentials',
      specializations: 'Specializations',
      years_experience: 'Years Experience',
      contact_email: 'Contact Email',
      is_active: 'Is Active',
      training_partner: 'Training Partner',
      training_tracks: 'Training Tracks',
    },
  },
  
  // Vendor
  'api::vendor.vendor': {
    displayName: 'Vendor',
    fields: {
      business_name: 'Business Name',
      slug: 'Slug',
      business_type: 'Business Type',
      description: 'Description',
      logo: 'Logo',
      cover_image: 'Cover Image',
      contact_email: 'Contact Email',
      contact_phone: 'Contact Phone',
      website: 'Website',
      location: 'Location',
      verified: 'Verified',
      training_status: 'Training Status',
      certification_date: 'Certification Date',
      is_active: 'Is Active',
      training_tracks: 'Training Tracks',
      premium_contents: 'Premium Contents',
    },
  },
  
  // Content Creator
  'api::content-creator.content-creator': {
    displayName: 'Content Creator',
    fields: {
      name: 'Name',
      slug: 'Slug',
      creator_type: 'Creator Type',
      organization: 'Organization',
      role: 'Role',
      bio: 'Bio',
      avatar: 'Avatar',
      email: 'Email',
      is_active: 'Is Active',
      premium_contents: 'Premium Contents',
    },
  },
  
  // Premium Content
  'api::premium-content.premium-content': {
    displayName: 'Premium Content',
    fields: {
      title: 'Title',
      slug: 'Slug',
      description: 'Description',
      content: 'Content',
      cover_image: 'Cover Image',
      gallery: 'Gallery',
      duration_hours: 'Duration Hours',
      max_capacity: 'Max Capacity',
      difficulty_level: 'Difficulty Level',
      age_suitability: 'Age Suitability',
      language: 'Language',
      location: 'Location',
      pricing: 'Pricing',
      what_included: 'What Included',
      what_to_bring: 'What To Bring',
      faq: 'FAQ',
      seo_metadata: 'SEO Metadata',
      is_featured: 'Is Featured',
      is_active: 'Is Active',
      premium_category: 'Premium Category',
      content_creator: 'Content Creator',
      vendor: 'Vendor',
      tags: 'Tags',
      publishedAt: 'Published At',
    },
  },
  
  // Training Track
  'api::training-track.training-track': {
    displayName: 'Training Track',
    fields: {
      title: 'Title',
      slug: 'Slug',
      description: 'Description',
      overview: 'Overview',
      cover_image: 'Cover Image',
      duration_hours: 'Duration Hours',
      difficulty_level: 'Difficulty Level',
      learning_objectives: 'Learning Objectives',
      max_capacity: 'Max Capacity',
      language: 'Language',
      location: 'Location',
      is_virtual: 'Is Virtual',
      pricing: 'Pricing',
      certificate_available: 'Certificate Available',
      applicable_launchpad_tracks: 'Applicable Launchpad Tracks',
      recommended_onboarding_stage: 'Recommended Onboarding Stage',
      required_certification_tier: 'Required Certification Tier',
      strapi_course_id: 'Strapi Course ID',
      vendor_prep_required: 'Vendor Prep Required',
      faq: 'FAQ',
      seo_metadata: 'SEO Metadata',
      is_featured: 'Is Featured',
      is_active: 'Is Active',
      training_category: 'Training Category',
      instructor: 'Instructor',
      training_partner: 'Training Partner',
      training_sessions: 'Training Sessions',
      prerequisites: 'Prerequisites',
      tags: 'Tags',
      publishedAt: 'Published At',
    },
  },
  
  // Training Session
  'api::training-session.training-session': {
    displayName: 'Training Session',
    fields: {
      title: 'Title',
      slug: 'Slug',
      description: 'Description',
      content: 'Content',
      order: 'Order',
      duration_minutes: 'Duration Minutes',
      session_type: 'Session Type',
      materials: 'Materials',
      video_url: 'Video URL',
      is_active: 'Is Active',
      training_track: 'Training Track',
    },
  },
  
  // Tag
  'api::tag.tag': {
    displayName: 'Tag',
    fields: {
      name: 'Name',
      slug: 'Slug',
      tag_type: 'Tag Type',
      description: 'Description',
      is_active: 'Is Active',
      premium_contents: 'Premium Contents',
      training_tracks: 'Training Tracks',
    },
  },
};

// Component label configs
const componentConfigs = {
  'shared.location': {
    displayName: 'Location',
    fields: {
      address: 'Address',
      city: 'City',
      region: 'Region',
      country: 'Country',
      latitude: 'Latitude',
      longitude: 'Longitude',
      postal_code: 'Postal Code',
    },
  },
  
  'shared.pricing': {
    displayName: 'Pricing',
    fields: {
      amount: 'Amount',
      currency: 'Currency',
      discount_amount: 'Discount Amount',
      discount_start_date: 'Discount Start Date',
      discount_end_date: 'Discount End Date',
      price_per_person: 'Price Per Person',
    },
  },
  
  'shared.seo': {
    displayName: 'SEO',
    fields: {
      meta_title: 'Meta Title',
      meta_description: 'Meta Description',
      og_image: 'OG Image',
      keywords: 'Keywords',
    },
  },
  
  'shared.faq': {
    displayName: 'FAQ',
    fields: {
      question: 'Question',
      answer: 'Answer',
    },
  },
  
  'shared.list-item': {
    displayName: 'List Item',
    fields: {
      item: 'Item',
    },
  },
  
  'shared.media-gallery': {
    displayName: 'Media Gallery',
    fields: {
      image: 'Image',
      caption: 'Caption',
      order: 'Order',
    },
  },
  
  'shared.attachment': {
    displayName: 'Attachment',
    fields: {
      file: 'File',
      title: 'Title',
      description: 'Description',
    },
  },
};

/**
 * Main migration function
 * Run via: npm run strapi -- admin:create-api-token
 * Then use that token with this script
 */
async function configureViewLabels(strapi) {
  console.log('[Configure View Labels] Starting migration...');
  
  try {
    // Configure content types
    for (const [uid, config] of Object.entries(labelConfigs)) {
      console.log(`\n[Configure View Labels] Processing content type: ${config.displayName}`);
      
      const settingKey = `plugin_content_manager_configuration_content_types::${uid}`;
      
      try {
        // Get existing settings
        const existing = await strapi.query('core_store').findOne({
          where: { key: settingKey },
        });
        
        // Build new configuration
        const newConfig = {
          key: settingKey,
          value: {
            uid: uid,
            settings: {
              bulkable: true,
              filterable: true,
              searchable: true,
              sortable: true,
              pageSize: 10,
              mainField: 'name',
              defaultSortBy: 'name',
              defaultSortOrder: 'ASC',
            },
            metaData: {
              unit: null,
            },
            layouts: {
              list: ['id', 'name', 'slug'],
              editRelations: [],
              edit: [
                [
                  {
                    name: 'name',
                    size: 6,
                    label: config.fields.name || toTitleCase('name'),
                  },
                ],
              ],
            },
            attributes: Object.entries(config.fields).reduce((acc, [fieldName, label]) => {
              acc[fieldName] = {
                label: label,
              };
              return acc;
            }, {}),
          },
        };
        
        if (existing) {
          await strapi
            .query('core_store')
            .update({
              where: { key: settingKey },
              data: { value: newConfig.value },
            });
          console.log(`  ✓ Updated configuration for ${config.displayName}`);
        } else {
          await strapi.query('core_store').create({ data: newConfig });
          console.log(`  ✓ Created configuration for ${config.displayName}`);
        }
      } catch (err) {
        console.error(`  ✗ Error configuring ${config.displayName}:`, err.message);
      }
    }
    
    // Configure components
    for (const [uid, config] of Object.entries(componentConfigs)) {
      console.log(`\n[Configure View Labels] Processing component: ${config.displayName}`);
      
      const settingKey = `plugin_content_manager_configuration_components::${uid}`;
      
      try {
        const existing = await strapi.query('core_store').findOne({
          where: { key: settingKey },
        });
        
        const newConfig = {
          key: settingKey,
          value: {
            uid: uid,
            settings: {
              bulkable: true,
              filterable: false,
            },
            metaData: {
              unit: null,
            },
            layouts: {
              list: [],
              editRelations: [],
              edit: [],
            },
            attributes: Object.entries(config.fields).reduce((acc, [fieldName, label]) => {
              acc[fieldName] = {
                label: label,
              };
              return acc;
            }, {}),
          },
        };
        
        if (existing) {
          await strapi
            .query('core_store')
            .update({
              where: { key: settingKey },
              data: { value: newConfig.value },
            });
          console.log(`  ✓ Updated configuration for ${config.displayName}`);
        } else {
          await strapi.query('core_store').create({ data: newConfig });
          console.log(`  ✓ Created configuration for ${config.displayName}`);
        }
      } catch (err) {
        console.error(`  �Error configuring component ${config.displayName}:`, err.message);
      }
    }
    
    console.log('\n[Configure View Labels] Migration completed successfully!');
  } catch (error) {
    console.error('[Configure View Labels] Migration failed:', error);
    throw error;
  }
}

module.exports = {
  configureViewLabels,
  labelConfigs,
  componentConfigs,
};
