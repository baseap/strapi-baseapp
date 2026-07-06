# Heritage CMS Implementation Plan

**Project:** Strapi Content Management System for Heritage Marketplace
**Date:** 2026-07-06
**Status:** Clean Slate - Full System Replacement

---

## Executive Summary

Complete replacement of default Strapi blog template with production-ready heritage tourism and training platform.

### Key Objectives
1. Replace all existing content types with heritage-focused collections
2. Implement dual category systems (Premium + Training with extensibility)
3. Create production-ready content schemas with full metadata
4. Pre-populate 7 Pillars taxonomy via bootstrap seed script
5. Enable vendor management and multi-vendor content
6. Support Flutter app integration via REST API

### Architecture Principle
**Strapi = Content Catalog** (static, vendor-managed content)
**Flutter + Supabase = Operations** (bookings, reviews, payments, user data)

---

## Phase 1: Cleanup & Preparation

### 1.1 Remove Existing Content Types

**Delete these directories:**
```bash
rm -rf src/api/article
rm -rf src/api/author
rm -rf src/api/category
rm -rf src/api/about
rm -rf src/api/global
```

### 1.2 Clean Seed Data
Clear `data/data.json` - will be replaced with 7 Pillars seed data

### 1.3 Keep Shared Components (Review)
- `src/components/shared/media` - useful for image fields
- `src/components/shared/rich-text` - useful for content
- Others can be deleted if not needed

---

## Phase 2: Core Collections

### 2.1 Premium Category Collection
**File:** `src/api/premium-category/content-types/premium-category/schema.json`

**Fields:**
- `name` (string, required, unique)
- `slug` (uid, auto-generated from name)
- `description` (text)
- `display_order` (integer, for sorting)
- `is_active` (boolean, default: true)


**Relationships:**
- One-to-Many with Premium Content

**Seed Data:** 7 Pillars (names + descriptions from taxonomy)

### 2.2 Training Category Collection
**File:** `src/api/training-category/content-types/training-category/schema.json`

**Fields:**
- `name` (string, required, unique)
- `slug` (uid, auto-generated from name)
- `what_it_covers` (rich text / markdown)
- `research_lineage` (text)
- `display_order` (integer)
- `is_active` (boolean, default: true)
- `parent_category` (relation, self-referencing many-to-one, optional)

**Relationships:**
- Self-referencing (for sub-categories)
- One-to-Many with Training Track

**Seed Data:** 7 Pillars (with full what_it_covers + research_lineage)

---

## Phase 3: People & Organizations Collections

### 3.1 Training Partner Collection
**File:** `src/api/training-partner/content-types/training-partner/schema.json`

**Purpose:** Educational institutions providing vendor training

**Fields:**
- `organization_name` (string, required)
- `slug` (uid, auto-generated)
- `organization_type` (enumeration: university, polytechnic, ngo, government, private)
- `description` (rich text)
- `logo` (media, single image)
- `cover_image` (media, single image)
- `contact_email` (email)
- `contact_phone` (string)
- `website` (string, url)
- `location` (component: Location)
- `accreditation` (text)
- `verified` (boolean, default: false)
- `is_active` (boolean, default: true)

**Relationships:**
- One-to-Many with Training Track 

**Examples:** XX University, ABC Polytechnic

### 3.2 Instructor Collection
**File:** `src/api/instructor/content-types/instructor/schema.json`

**Purpose:** Teachers/experts (flexible, can be independent)

**Fields:**
- `name` (string, required)
- `slug` (uid, auto-generated)
- `title` (string, e.g., "Professor", "Dr.")
- `bio` (rich text)
- `avatar` (media, single image)
- `credentials` (text)
- `specializations` (string, multiple values)
- `years_experience` (integer)
- `contact_email` (email)
- `is_active` (boolean, default: true)

**Relationships:**
- Many-to-One with Training Partner (optional)
- One-to-Many with Training Track

**Examples:** Prof. Ahmad, Dr. Sarah (Independent)

### 3.3 Vendor Collection
**File:** `src/api/vendor/content-types/vendor/schema.json`

**Purpose:** Heritage businesses (trained, deliver experiences)

**Fields:**
- `business_name` (string, required)
- `slug` (uid, auto-generated)
- `business_type` (enumeration: individual, cooperative, sme, enterprise)
- `description` (rich text)
- `logo` (media, single image)
- `cover_image` (media, single image)
- `contact_email` (email)
- `contact_phone` (string)
- `website` (string, url)
- `location` (component: Location)
- `verified` (boolean, default: false)
- `training_status` (enumeration: pending, in_progress, certified)
- `certification_date` (date)
- `is_active` (boolean, default: true)

**Relationships:**
- Many-to-Many with Training Track (completed training)
- One-to-Many with Premium Content (deliver experiences)

**Examples:** Batik Heritage Workshop

### 3.4 Content Creator Collection
**File:** `src/api/content-creator/content-types/content-creator/schema.json`

**Purpose:** Staff/contributors who create Premium Content

**Fields:**
- `name` (string, required)
- `slug` (uid, auto-generated)
- `creator_type` (enumeration: internal_staff, guest_contributor, partner_organization)
- `organization` (string, if external)
- `role` (string)
- `bio` (rich text)
- `avatar` (media, single image)
- `email` (email)
- `is_active` (boolean, default: true)

**Relationships:**
- One-to-Many with Premium Content (created content)

**Examples:** Sarah Chen (Your Staff), Heritage Malaysia (Partner)

---

## Phase 4: Content Collections

### 4.1 Premium Content Collection
**File:** `src/api/premium-content/content-types/premium-content/schema.json`

**Fields:**
- `title` (string, required)
- `slug` (uid, auto-generated)
- `description` (text, short summary)
- `content` (rich text, detailed description)
- `cover_image` (media, single image)
- `gallery` (component: MediaGallery, repeatable)
- `duration_hours` (decimal)
- `max_capacity` (integer)
- `difficulty_level` (enumeration: beginner, intermediate, advanced)
- `age_suitability` (string)
- `language` (string)
- `location` (component: Location)
- `pricing` (component: Pricing)
- `what_included` (component: ListItem, repeatable)
- `what_to_bring` (component: ListItem, repeatable)
- `faq` (component: FAQ, repeatable)

- `seo_metadata` (component: SEO)
- `is_featured` (boolean, default: false)
- `is_active` (boolean, default: true)

**Relationships:**
- Many-to-One with Premium Category
- Many-to-One with Content Creator (who created it)
- Many-to-One with Vendor (who delivers it on-site)
- Many-to-Many with Tag

**Draft/Publish:** Enabled

### 4.2 Training Track Collection
**File:** `src/api/training-track/content-types/training-track/schema.json`

**Core Fields:**
- `title` (string, required)
- `slug` (uid, auto-generated)
- `description` (text)
- `overview` (rich text)
- `cover_image` (media, single image)
- `duration_hours` (decimal, total estimated hours for track completion)
- `difficulty_level` (enumeration: beginner, intermediate, advanced)
- `learning_objectives` (text, bullet points)
- `max_capacity` (integer, for in-person sessions)
- `language` (string, content language)
- `location` (component: Location, only if in-person)
- `is_virtual` (boolean, default: false — for identifying purely virtual tracks)
- `pricing` (component: Pricing, optional)
- `certificate_available` (boolean)

**Launchpad Integration Fields:**
- `applicable_launchpad_tracks` (enumeration, multiple values, required)
  - Which vendor tracks this applies to: `cultural_experience | service | product | health_activity`
  - Example: Cultural Heritage track applies only to `cultural_experience` vendors
  - Service training applies to `service` and `health_activity` tracks
  
- `recommended_onboarding_stage` (enumeration, default: anytime)
  - Timing guidance for when vendor should take this:
    - `pre_certification` — before initial certification assessment
    - `post_certification` — after first certification passed
    - `tier_progression` — to unlock higher tiers
    - `anytime` — available at any point
  
- `required_certification_tier` (integer, optional)
  - Minimum tier level (1-5) vendor must have achieved to access
  - Example: Tier 2 or higher only
  - Null = available to all tiers
  
- `strapi_course_id` (string, optional)
  - Stub identifier linking to external course/enrollment system
  - Used by Supabase STM system to track vendor enrollment and completion
  - Format: string (future-proof for different ID formats)
  - Currently stubbed; populate with real course IDs in content sprint

- `vendor_prep_required` (boolean, default: false)
  - Whether vendor must complete pre-work before attending
  - Example: read material, submit questionnaire, complete setup checklist

**Supporting Fields:**
- `faq` (component: FAQ, repeatable)
- `seo_metadata` (component: SEO)
- `is_featured` (boolean)
- `is_active` (boolean, default: true)

**Relationships:**
- Many-to-One with Training Category (which pillar/domain)
- Many-to-One with Instructor (who teaches)
- Many-to-One with Training Partner (optional, which institution hosts)
- One-to-Many with Training Session (course modules/sessions)
- Many-to-Many with Prerequisites (self-referencing, Track A before Track B)
- Many-to-Many with Tag (cross-cutting metadata)

**Draft/Publish:** Enabled

**Example Use Cases:**

1. **Cultural Heritage Standards (for Cultural Experience vendors post-certification)**
   - `applicable_launchpad_tracks`: `['cultural_experience']`
   - `recommended_onboarding_stage`: `'post_certification'`
   - `required_certification_tier`: null (all tiers)
   - `strapi_course_id`: `"heritage_standards_101"`

2. **Wellness Instructor Fundamentals (for Health Activity vendors)**
   - `applicable_launchpad_tracks`: `['health_activity']`
   - `recommended_onboarding_stage`: `'pre_certification'`
   - `required_certification_tier`: null
   - `is_virtual`: true
   - `strapi_course_id`: `"wellness_fundamentals_001"`

3. **Tier 3 Advanced Hospitality (for progressing vendors)**
   - `applicable_launchpad_tracks`: `['cultural_experience', 'service']`
   - `recommended_onboarding_stage`: `'tier_progression'`
   - `required_certification_tier`: 3
   - `strapi_course_id`: `"advanced_hospitality_t3"`

### 4.3 Training Session Collection
**File:** `src/api/training-session/content-types/training-session/schema.json`

**Fields:**
- `title` (string, required)
- `slug` (uid, auto-generated)
- `description` (text)
- `content` (rich text)
- `order` (integer, for sequencing within track)
- `duration_minutes` (integer)
- `session_type` (enumeration: lecture, workshop, practice, assessment)
- `materials` (component: Attachment, repeatable)
- `video_url` (string, url)
- `is_active` (boolean, default: true)

**Relationships:**
- Many-to-One with Training Track

---

### 4.3a Training Track — Launchpad Integration Notes

**Flutter Query Examples:**

```bash
# Get all training for Cultural Experience vendors (post-certification)
GET /api/training-tracks?filters[applicable_launchpad_tracks][$contains]=cultural_experience&filters[recommended_onboarding_stage][$eq]=post_certification&populate=*&locale=en

# Get Tier 3+ advancement trainings
GET /api/training-tracks?filters[required_certification_tier][$gte]=3&filters[applicable_launchpad_tracks][$contains]=cultural_experience&populate=*

# Get pre-certification prep for new vendors
GET /api/training-tracks?filters[recommended_onboarding_stage][$eq]=pre_certification&filters[applicable_launchpad_tracks][$contains]=cultural_experience&populate=*
```

**Supabase Edge Function Integration:**

When vendor enrolls in a Training Track via Flutter:
1. Flutter reads `strapi_course_id` from Training Track
2. Sends enrollment to Supabase: `INSERT INTO vendor_course_enrollments (vendor_id, strapi_course_id, track_name, enrolled_at)`
3. Supabase STM system tracks completion
4. On completion, Supabase AVI system checks `recommended_onboarding_stage`:
   - If `tier_progression` → triggers tier unlock workflow
   - If `post_certification` → awards coaching points
5. Flutter polls enrollment status and updates UI

**Stub Course IDs:**

All `strapi_course_id` values are currently stubs. Replace in content sprint:
- Phase format: `{track}_{category}_{version}` (e.g., `cultural_foodways_standards_v1`)
- Coordinate with Supabase team to define authoritative course ID format

---

## Phase 5: Supporting Collections

### 5.1 Tag Collection
**File:** `src/api/tag/content-types/tag/schema.json`

**Fields:**
- `name` (string, required, unique)
- `slug` (uid, auto-generated)
- `tag_type` (enumeration: topic, skill, region, heritage_type)
- `description` (text)
- `is_active` (boolean, default: true)

**Relationships:**
- Many-to-Many with Premium Content
- Many-to-Many with Training Track

---

## Phase 6: Shared Components

### 6.1 Location Component
**File:** `src/components/shared/location.json`

**Fields:**
- `address` (string)
- `city` (string)
- `region` (string)
- `country` (string)
- `latitude` (decimal)
- `longitude` (decimal)
- `postal_code` (string)


### 6.2 Pricing Component
**File:** `src/components/shared/pricing.json`

**Fields:**
- `amount` (decimal, required)
- `currency` (enumeration: USD, EUR, MYR, THB, IDR, SGD)
- `discount_amount` (decimal, optional)
- `discount_start_date` (date, optional)
- `discount_end_date` (date, optional)
- `price_per_person` (boolean)

### 6.3 SEO Component
**File:** `src/components/shared/seo.json`

**Fields:**
- `meta_title` (string, max 60 chars)
- `meta_description` (text, max 160 chars)
- `og_image` (media, single image)
- `keywords` (string, comma-separated)

### 6.4 FAQ Component
**File:** `src/components/shared/faq.json`

**Fields:**
- `question` (string, required)
- `answer` (text, required)

### 6.5 ListItem Component
**File:** `src/components/shared/list-item.json`

**Fields:**
- `item` (string, required)

### 6.6 MediaGallery Component
**File:** `src/components/shared/media-gallery.json`

**Fields:**
- `image` (media, single image, required)
- `caption` (string)
- `order` (integer)

### 6.7 Attachment Component
**File:** `src/components/shared/attachment.json`

**Fields:**
- `file` (media, single file)
- `title` (string)
- `description` (text)

---

## Phase 7: Seed Script for 7 Pillars

### 7.1 Create Seed Script
**File:** `scripts/seed-categories.js`

Script will populate both Premium Category and Training Category with the 7 Pillars:

1. **Culinary Heritage & Foodways**
2. **Traditional Craftsmanship & Arts**
3. **Performing Arts & Self-Defense**
4. **Rituals, Games & Festive Events**
5. **Nature, Ecology & Occupations**
6. **Oral Traditions & Folklore**
7. **Daily Life, Etiquette & Community Immersion**

**Features:**
- Idempotent (check if category exists by slug before creating)
- Includes full taxonomy data (name, description, what_it_covers, research_lineage)

- Display order based on `display_order` field
- Auto-run on first deployment or manual execution

**Run command:**
```bash
npm run seed:categories
```

---

## Phase 8: Configuration & Permissions

### 8.1 API Permissions
Configure in Strapi Admin: **Settings > Roles > Public**

**Public Read Access:**
- Premium Category (find, findOne)
- Training Category (find, findOne)
- Premium Content (find, findOne) - only published
- Training Track (find, findOne) - only published
- Training Session (find, findOne)
- Instructor (find, findOne)
- Training Partner (find, findOne)
- Tag (find, findOne)
- ⚠️ **Vendor (CUSTOM - sanitized view only)**
- ⚠️ **Content Creator (CUSTOM - sanitized view only)**

**Authenticated/Admin Only:**
- All Create, Update, Delete operations
- Draft content access
- Vendor sensitive data
- Content Creator sensitive data

### 8.2 Critical: Vendor Data Privacy Protection
**File:** `src/api/vendor/controllers/vendor.js`

**Problem:** Public vendor endpoint exposes contact info (email, phone) → scraping risk

**Solution:** Custom controller with sanitized public response

```javascript
module.exports = {
  async find(ctx) {
    const vendors = await strapi.documents('api::vendor.vendor').findMany(ctx.query);
    
    // Sanitize: only expose safe fields
    const sanitized = vendors.map(v => ({
      id: v.id,
      business_name: v.business_name,
      slug: v.slug,
      description: v.description,
      logo: v.logo,
      cover_image: v.cover_image,
      verified: v.verified,
      // EXCLUDE: contact_email, contact_phone, location, website
    }));
    
    return sanitized;
  }
};
```

**Exposed:** business_name, logo, description, verified status
**Hidden:** email, phone, exact location, training status

### 8.2 Media Upload Configuration
**File:** `config/plugins.js`

Configure upload limits and providers as needed

### 8.3 Internationalization (i18n) Setup
**Enable for multi-region support (Thai, Malay, Indonesian, English)**

**Install i18n plugin:**
```bash
npm install @strapi/plugin-i18n
```

**Enable i18n on collections:**
- Premium Category (7 Pillars in local languages)
- Training Category (7 Pillars in local languages)
- Premium Content (translated experiences)
- Training Track (translated training materials)

**Configuration:** In each schema.json:
```json
{
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  }
}
```

**Supported Locales:** (configure in Strapi admin)
- `en` - English (default)
- `th` - Thai
- `ms` - Malay
- `id` - Indonesian

**API Usage:**
```
GET /api/premium-contents?locale=th  // Thai content
GET /api/premium-contents?locale=en  // English content
```

**Flutter Integration:** Pass device locale from `Localizations.localeOf(context)`

---

## Phase 9: Testing & Verification

### 9.1 Local Testing Checklist

- [ ] All content types visible in Strapi admin
- [ ] Create test entries for each collection
- [ ] Verify relationships work correctly
- [ ] Test seed script populates 7 Pillars
- [ ] Check API endpoints return correct data
- [ ] Verify draft/publish workflow
- [ ] Test media uploads
- [ ] Confirm slug auto-generation

**Test API endpoints:**
```bash
# Categories
curl http://localhost:1337/api/premium-categories
curl http://localhost:1337/api/training-categories

# Content
curl http://localhost:1337/api/premium-contents?populate=*
curl http://localhost:1337/api/training-tracks?populate=*

# People & Organizations
curl http://localhost:1337/api/vendors
curl http://localhost:1337/api/instructors
curl http://localhost:1337/api/training-partners
curl http://localhost:1337/api/content-creators
```

### 9.2 Pre-Deployment Checklist
- [ ] All schemas validated
- [ ] Seed script tested locally
- [ ] API permissions configured
- [ ] Media upload working
- [ ] Git committed with clear message
- [ ] .env variables documented

---

## Phase 10: Deployment

### 10.1 Git Workflow

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: implement heritage CMS with 7 Pillars taxonomy

- Replace blog template with heritage collections
- Add Premium/Training category systems
- Create Training Partner, Instructor, Vendor, Content Creator models
- Add Premium Content and Training Track collections
- Include Location, Pricing, SEO components
- Add seed script for 7 Pillars taxonomy"

# Push to GitHub
git push origin main
```

### 10.2 Strapi Cloud Deployment
Once pushed to GitHub, Strapi Cloud will:
1. Detect the push automatically
2. Pull latest code
3. Run build process
4. Deploy new schema to production
5. Available at: `https://positive-acoustics-345fa51dc4.strapiapp.com`

**Deployment time:** ~2-5 minutes

### 10.3 Post-Deployment
1. Login to Strapi Cloud admin panel
2. Run seed script (if not auto-executed)
3. Verify 7 Pillars categories exist
4. Create initial content entries
5. Test API endpoints from Flutter app
6. Configure any Cloud-specific environment variables

---

## Phase 11: Flutter App Integration

### 11.1 Update Flutter Models
Create Dart models matching Strapi schemas:

- `PremiumCategory`
- `TrainingCategory`
- `PremiumContent`
- `TrainingTrack`
- `TrainingSession`
- `Instructor`
- `TrainingPartner`
- `Vendor`
- `ContentCreator`
- `Tag`

### 11.2 Update API Service
Point to new Strapi endpoints via Supabase Edge Function (strapi-proxy)

### 11.3 Test Integration
- Fetch categories and display in app
- Fetch Premium Content and render details
- Fetch Training Tracks for vendor onboarding
- Verify relationships populate correctly

---

## Architecture Summary

### Collections Overview (9 total)
1. **Premium Category** - 7 Pillars for customer experiences
2. **Training Category** - 7 Pillars for vendor education (extensible)
3. **Training Partner** - Educational institutions
4. **Instructor** - Teachers/experts
5. **Vendor** - Heritage businesses (trained, deliver experiences)
6. **Content Creator** - Staff/contributors (create experiences)
7. **Premium Content** - Customer-facing heritage experiences
8. **Training Track** - Vendor education courses
9. **Training Session** - Course modules
10. **Tag** - Cross-cutting metadata

### Key Relationships
```
TRAINING SIDE:
Training Partner → Instructor → Training Track → Training Session
                                     ↓
                                  Vendors (complete training)

CONTENT SIDE:
Content Creator → Premium Content → Vendor (delivers on-site)
                       ↓
                  Premium Category (7 Pillars)
```

---

## Next Steps

1. **Review this document** - confirm all requirements captured
2. **Start Phase 1** - cleanup existing content types
3. **Build collections** - create schemas phase by phase
4. **Create seed script** - populate 7 Pillars
5. **Test locally** - verify everything works
6. **Deploy** - push to Git → Strapi Cloud
7. **Integrate Flutter** - connect app to new API

**Estimated implementation time:** 4-6 hours

---

**Document Complete**
Ready for implementation!


---

## CRITICAL IMPLEMENTATION NOTES

### Schema Configuration Standards

#### 1. Pluralization Strategy
**Display Name: SINGULAR | API Endpoint: PLURAL (auto)**

In each `schema.json`, use this structure:

```json
{
  "info": {
    "singularName": "premium-content",
    "pluralName": "premium-contents",
    "displayName": "Premium Content"  // ← SINGULAR
  }
}
```

**Result:**
- Admin UI shows: "Premium Content" (singular, intuitive)
- API endpoint: `/api/premium-contents` (plural, RESTful)
- Query: `GET /api/premium-contents` (Strapi handles pluralization)

**Apply to ALL collections:**
- ✅ "Premium Content" → `/api/premium-contents`
- ✅ "Training Track" → `/api/training-tracks`
- ✅ "Training Partner" → `/api/training-partners`
- ✅ "Content Creator" → `/api/content-creators`
- ✅ "Instructor" → `/api/instructors`
- ✅ "Vendor" → `/api/vendors`

#### 2. Rich Text Field Configuration
**For `what_it_covers`, `bio`, `description`, `content` fields:**

Use Strapi's native `richtext` type (NOT `text`):

```json
{
  "what_it_covers": {
    "type": "richtext"  // ← Enables visual markdown editor
  }
}
```

**This provides:**
- Visual WYSIWYG editor in Strapi admin
- Markdown formatting (bold, italic, lists, links)
- Media embedding
- Better content authoring experience

**NOT this:**
```json
{
  "what_it_covers": {
    "type": "text"  // ← Plain textarea, no formatting
  }
}
```

**Apply `richtext` to:**
- Training Category: `what_it_covers`
- Premium Content: `content`
- Training Track: `overview`
- Training Session: `content`
- Vendor: `description`
- Training Partner: `description`
- Instructor: `bio`
- Content Creator: `bio`

---


---

## OPERATIONAL IMPROVEMENTS

### 1. Strapi v5 Document Service API (Critical for Cloud)

**Seed Script Must Use v5 Syntax:**

```javascript
// ✅ CORRECT (Strapi v5):
await strapi.documents('api::premium-category.premium-category').create({
  data: {
    name: 'Culinary Heritage & Foodways',
    slug: 'culinary-heritage-foodways',
    description: '...',
    display_order: 1
  }
});

// ❌ WRONG (Strapi v4 - will fail on Cloud):
await strapi.entityService.create('api::premium-category.premium-category', {
  data: { ... }
});
```

**Why:** Strapi Cloud runs v5. Old `entityService` API removed. Seed script will crash if using v4 syntax.

**Apply to:** All seed scripts, custom controllers, lifecycle hooks

---

### 2. API Query Optimization (Performance)

**Problem:** `populate=*` is shallow and slow

**Solution: Explicit Population**

```javascript
// ❌ Bad (shallow, slow):
GET /api/premium-contents?populate=*

// ✅ Good (explicit, fast):
GET /api/premium-contents?populate[category]=true&populate[location]=true&populate[pricing]=true&populate[gallery][populate]=*

// ✅ Better (Strapi Transformer Plugin - flatten response):
GET /api/premium-contents
// Returns flat JSON without nested data/attributes blocks
```

**For Flutter:** Use explicit population queries to get exact data needed. Consider Strapi Transformer Plugin to flatten response.

**Installation:**
```bash
npm install strapi-plugin-transformer
```

**Benefits:**
- Removes `data` and `attributes` nesting
- Lighter payloads for mobile
- Easier Flutter parsing

---

### 3. Deep Population for Components

**Components require nested population:**

```javascript
// MediaGallery component population:
?populate[gallery][populate]=image

// Location component (always populated):
?populate[location]=true

// Pricing component:
?populate[pricing]=true

// FAQ component:
?populate[faq]=true
```

**Flutter Data Models:** Must handle component structure:
```dart
// Strapi returns:
{
  "location": {
    "city": "Yogyakarta",
    "latitude": -7.7956
  }
}
```

---

### 4. Content Creator Controller (Privacy)

Similar to Vendor, Content Creator needs sanitized public view:

**File:** `src/api/content-creator/controllers/content-creator.js`

```javascript
module.exports = {
  async find(ctx) {
    const creators = await strapi.documents('api::content-creator.content-creator').findMany(ctx.query);
    
    return creators.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      creator_type: c.creator_type,
      organization: c.organization,
      avatar: c.avatar,
      // EXCLUDE: email, internal notes
    }));
  }
};
```

---

**All operational improvements documented. Implementation ready.**


---

## CRITICAL PRODUCTION ISSUES

### 1. Multi-Region Localization ID Fallacy (CRITICAL for Flutter)

**Problem:** In Strapi v5 with i18n enabled, localized records have DIFFERENT database IDs per language:
- English "Culinary Heritage" → ID: 1
- Thai "Culinary Heritage" → ID: 2 (different record!)
- Malay "Culinary Heritage" → ID: 3 (different record!)

**If Flutter caches or queries by integer ID:** Regional UI breaks, wrong data displays

**The Fix: Use documentId (NOT id) for all relationships**

Strapi v5 provides `documentId` - a stable string identifier that clusters all language versions:

```javascript
// Strapi v5 response structure:
{
  "id": 1,  // ❌ Changes per locale
  "documentId": "iujm783gshd82jks",  // ✅ CONSISTENT across all locales
  "attributes": {
    "name": "Culinary Heritage & Foodways",
    "slug": "culinary-heritage-foodways"  // ✅ Also consistent
  }
}
```

**Flutter API Integration Rules:**

1. **Query by slug (string), never ID:**
```bash
# ✅ CORRECT - works across all locales
GET /api/premium-categories?filters[slug][$eq]=culinary-heritage-foodways&locale=th

# ❌ WRONG - breaks when i18n enabled
GET /api/premium-categories/1?locale=th  # ID 1 might not exist in Thai!
```

2. **Use documentId for deep relationships:**
```bash
# ✅ When linking training tracks to categories in code
documentId = "iujm783gshd82jks"  // Use this

# ❌ Don't use
categoryId = 1  // This changes per language
```

3. **Cache key strategy:**
```dart
// Flutter caching by slug + locale (not ID)
final cacheKey = 'category_${slug}_${locale}';

// Not:
final cacheKey = 'category_$id';  // WRONG - breaks with i18n
```

**Implementation:**
- All Flutter API queries must populate `?populate=*` to include documentId
- Store documentId in local cache, not integer id
- Map relationships using documentId, not id

---

### 2. Media Upload Storage on Strapi Cloud (CRITICAL)

**Problem:** Strapi Cloud uses ephemeral file system. On every deployment or restart:
- All uploaded images → **DELETED**
- Vendor logos, product covers, training materials → **GONE**
- Data loss on every Git push!

**Default Strapi behavior:**
```
/public/uploads/  ← Saved to disk
↓
Deployment triggers → Container restart
↓
Disk cleared → All media files VANISHED
```

**The Fix: Configure Cloudflare R2 as upload provider (use existing infrastructure)**

You already use Cloudflare R2 in your Flutter app. Strapi should use the same bucket:

```bash
# Cloudflare R2 CDN URL (already configured in your .env)
https://pub-01572daafcdf4cfb9caf2010fb5809c2.r2.dev
```

**Configuration:**

**File:** `config/plugins.js`

```javascript
module.exports = {
  upload: {
    config: {
      provider: 'cloudflare-r2',
      providerOptions: {
        accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID,
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
        endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
        bucket: 'baseapp-media',  // Or your existing bucket
        directory: 'strapi',
        cdnUrl: process.env.CLOUDFLARE_R2_CDN_URL,
      },
    },
  },
};
```

**Environment Variables (set in Strapi Cloud - use your existing R2 config):**
```bash
CLOUDFLARE_R2_ACCOUNT_ID=xxxxx
CLOUDFLARE_R2_ACCESS_KEY_ID=xxxxx
CLOUDFLARE_R2_SECRET_ACCESS_KEY=xxxxx
CLOUDFLARE_R2_ENDPOINT=https://xxxxx.r2.cloudflarestorage.com
CLOUDFLARE_R2_CDN_URL=https://pub-01572daafcdf4cfb9caf2010fb5809c2.r2.dev
```

**Installation:**

```bash
npm install @strapi/plugin-upload-cloudflare-r2
```

**Benefits:**
- ✅ Media persists across deployments
- ✅ CDN-backed delivery (fast downloads)
- ✅ **Zero additional cost** (already paying for R2)
- ✅ Same storage as your Flutter app (centralized)
- ✅ Seamless with existing infrastructure

**Flutter Integration:**

```dart
// Media URLs returned by Strapi API will use your R2 CDN
// Example: https://pub-01572daafcdf4cfb9caf2010fb5809c2.r2.dev/strapi/logo.png

// Flutter already handles these URLs
Image.network(vendor.logo.url)  // Works seamlessly
```

---

**Both issues must be addressed before Phase 8 (Configuration).**
