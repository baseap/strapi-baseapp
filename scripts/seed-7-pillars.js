#!/usr/bin/env node

/**
 * seed-7-pillars.js
 * 
 * Seeds the Strapi database with the 7 Pillars taxonomy for Premium and Training Categories.
 * Uses Strapi v5 Document Service API.
 * 
 * Usage:
 *   npm run seed:pillars
 *   or
 *   node scripts/seed-7-pillars.js
 */

const path = require('path');

// The 7 canonical pillars (exactly as specified)
const SEVEN_PILLARS = [
  {
    name: 'Culinary Heritage & Foodways',
    slug: 'culinary-heritage-foodways',
    description: 'Traditional food preparation, cooking methods, and culinary traditions',
    what_it_covers: 'Explore the history and techniques of heritage cuisine, from ingredient sourcing to traditional cooking methods and table customs.',
    research_lineage: 'Culinary anthropology and food heritage studies',
    display_order: 1,
  },
  {
    name: 'Traditional Craftsmanship & Arts',
    slug: 'traditional-craftsmanship-arts',
    description: 'Handmade crafts, traditional art forms, and artisan skills',
    what_it_covers: 'Learn traditional craft techniques including textiles, woodwork, ceramics, metalwork, and visual arts passed down through generations.',
    research_lineage: 'Arts and crafts preservation, cultural heritage conservation',
    display_order: 2,
  },
  {
    name: 'Performing Arts & Self-Defense',
    slug: 'performing-arts-self-defense',
    description: 'Traditional music, dance, theater, and martial arts',
    what_it_covers: 'Discover traditional performing arts forms and martial disciplines that embody cultural values and physical discipline.',
    research_lineage: 'Ethnomusicology, dance anthropology, martial arts philosophy',
    display_order: 3,
  },
  {
    name: 'Rituals, Games & Festive Events',
    slug: 'rituals-games-festive-events',
    description: 'Cultural ceremonies, traditional games, and celebration practices',
    what_it_covers: 'Understand the significance of rituals, traditional games, and festive celebrations in cultural identity and community bonding.',
    research_lineage: 'Ritual studies, ethnography, festival traditions',
    display_order: 4,
  },
  {
    name: 'Nature, Ecology & Occupations',
    slug: 'nature-ecology-occupations',
    description: 'Traditional livelihoods, ecological knowledge, and environmental practices',
    what_it_covers: 'Learn sustainable practices, traditional farming methods, fishing techniques, and ecological knowledge systems.',
    research_lineage: 'Ethnoecology, traditional knowledge systems, environmental anthropology',
    display_order: 5,
  },
  {
    name: 'Oral Traditions & Folklore',
    slug: 'oral-traditions-folklore',
    description: 'Stories, legends, proverbs, and oral history',
    what_it_covers: 'Explore storytelling traditions, folklore, legends, and the oral transmission of cultural knowledge and values.',
    research_lineage: 'Folklore studies, oral history, narrative anthropology',
    display_order: 6,
  },
  {
    name: 'Daily Life, Etiquette & Community Immersion',
    slug: 'daily-life-etiquette-community',
    description: 'Social customs, protocols, and community practices',
    what_it_covers: 'Immerse in daily cultural practices, social etiquette, community traditions, and the lived experience of heritage communities.',
    research_lineage: 'Ethnography, social anthropology, community studies',
    display_order: 7,
  },
];

async function seedPillars() {
  try {
    console.log('🌱 Starting seed: 7 Pillars of Heritage...\n');

    // Bootstrap Strapi instance
    const Strapi = require(path.resolve(__dirname, '../node_modules/@strapi/core/dist')).Strapi;
    const strapi = new Strapi({
      appDir: path.resolve(__dirname, '..'),
      distDir: path.resolve(__dirname, '../dist'),
    });

    console.log('⏳ Loading Strapi instance...');
    await strapi.load();

    // Seed Premium Categories (7 Pillars)
    console.log('📚 Seeding Premium Categories...\n');
    let premiumCount = 0;
    
    for (const pillar of SEVEN_PILLARS) {
      try {
        // Check if category already exists
        const existing = await strapi
          .documents('api::premium-category.premium-category')
          .findFirst({
            filters: { slug: pillar.slug },
          });

        if (!existing) {
          await strapi.documents('api::premium-category.premium-category').create({
            data: {
              name: pillar.name,
              slug: pillar.slug,
              description: pillar.description,
              display_order: pillar.display_order,
              is_active: true,
            },
          });
          console.log(`  ✅ Created: ${pillar.name}`);
          premiumCount++;
        } else {
          console.log(`  ℹ️  Already exists: ${pillar.name}`);
        }
      } catch (err) {
        console.error(`  ❌ Error creating ${pillar.name}:`, err.message);
      }
    }

    // Seed Training Categories (7 Pillars with extended data)
    console.log('\n📖 Seeding Training Categories...\n');
    let trainingCount = 0;
    
    for (const pillar of SEVEN_PILLARS) {
      try {
        // Check if category already exists
        const existing = await strapi
          .documents('api::training-category.training-category')
          .findFirst({
            filters: { slug: pillar.slug },
          });

        if (!existing) {
          await strapi.documents('api::training-category.training-category').create({
            data: {
              name: pillar.name,
              slug: pillar.slug,
              what_it_covers: pillar.what_it_covers,
              research_lineage: pillar.research_lineage,
              display_order: pillar.display_order,
              is_active: true,
              parent_category: null, // Top-level pillars
            },
          });
          console.log(`  ✅ Created: ${pillar.name}`);
          trainingCount++;
        } else {
          console.log(`  ℹ️  Already exists: ${pillar.name}`);
        }
      } catch (err) {
        console.error(`  ❌ Error creating ${pillar.name}:`, err.message);
      }
    }

    console.log('\n📊 Seed Summary:');
    console.log(`  Premium Categories: ${premiumCount} created`);
    console.log(`  Training Categories: ${trainingCount} created`);
    console.log('\n✨ Seed completed successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  seedPillars();
}

module.exports = { seedPillars, SEVEN_PILLARS };
