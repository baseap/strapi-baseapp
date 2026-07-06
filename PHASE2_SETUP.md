# Phase 2: Seed Data & API Testing Setup

Complete guide to populate the Strapi CMS with test data and verify API endpoints.

## Quick Start

```bash
# 1. Start local Strapi dev server
npm run develop

# 2. In another terminal, seed the 7 Pillars
npm run seed:pillars

# 3. Test all API endpoints
./scripts/test-api-endpoints.sh local

# 4. Verify in admin: http://localhost:1337/admin
```

---

## Step 1: Seed the 7 Pillars Taxonomy

The seed script populates both Premium Categories and Training Categories with the heritage taxonomy.

### Run Locally

```bash
# Make sure Strapi dev server is running first!
npm run seed:pillars
```

**Output:**
```
🌱 Starting seed: 7 Pillars of Heritage...

⏳ Loading Strapi instance...
📚 Seeding Premium Categories...

  ✅ Created: Culinary Heritage & Foodways
  ✅ Created: Traditional Craftsmanship & Arts
  ✅ Created: Performing Arts & Self-Defense
  ✅ Created: Rituals, Games & Festive Events
  ✅ Created: Nature, Ecology & Occupations
  ✅ Created: Oral Traditions & Folklore
  ✅ Created: Daily Life, Etiquette & Community Immersion

📖 Seeding Training Categories...

  ✅ Created: Culinary Heritage & Foodways
  ✅ Created: Traditional Craftsmanship & Arts
  ... (7 total)

📊 Seed Summary:
  Premium Categories: 7 created
  Training Categories: 7 created

✨ Seed completed successfully!
```

### What Gets Created

**Premium Categories** (for customer-facing experiences):
- Name, slug, description, display_order, is_active

**Training Categories** (for vendor education):
- Name, slug, what_it_covers (rich text), research_lineage, display_order, is_active

### Run on Strapi Cloud

The seed script requires a running Strapi instance. On Strapi Cloud:

1. Access Strapi admin: https://positive-acoustics-345fa51dc4.strapiapp.com/admin
2. Manually create the 7 categories via the UI, OR
3. Contact Strapi support to run post-deployment scripts

---

## Step 2: Test API Endpoints

Verify all endpoints are working and returning data.

### Local Testing

```bash
# Make sure Strapi is running on port 1337
./scripts/test-api-endpoints.sh local
```

### Cloud Testing

```bash
./scripts/test-api-endpoints.sh cloud
```

### What Gets Tested

**Collections:**
- Premium Categories
- Training Categories
- Training Partners
- Instructors
- Vendors
- Content Creators
- Premium Content
- Training Tracks
- Training Sessions
- Tags

**Filtered Queries:**
- Active categories/partners
- Cultural experience tracks
- Certified vendors

**Pagination:**
- Page navigation
- Page size limits

### Expected Output

```
🧪 Testing LOCAL Strapi instance
Base URL: http://localhost:1337/api

📋 Collection Endpoints
Testing Premium Categories... ✓ (200)
  Found 7 items
Testing Training Categories... ✓ (200)
  Found 7 items
Testing Training Partners... ✓ (200)
  Found 0 items
...
📊 Results
Passed: 24
Failed: 0

✨ All tests passed!
```

---

## Step 3: Verify in Admin Panel

1. **Login to Strapi Admin:**
   - Local: http://localhost:1337/admin
   - Cloud: https://positive-acoustics-345fa51dc4.strapiapp.com/admin

2. **Check Premium Categories:**
   - Click "Premium Category" in Content Manager
   - Should see 7 pillars listed
   - Verify field labels display as Title Case (not snake_case)

3. **Check Training Categories:**
   - Should see 7 pillars with descriptions and research lineage

4. **Test API from Strapi:**
   - Use Strapi's built-in API explorer
   - Or curl:
   ```bash
   curl http://localhost:1337/api/premium-categories
   ```

---

## Step 4: API Response Format

Strapi v5 returns data in this structure:

```json
{
  "data": [
    {
      "id": 1,
      "documentId": "abc123xyz",
      "attributes": {
        "name": "Culinary Heritage & Foodways",
        "slug": "culinary-heritage-foodways",
        "description": "...",
        "display_order": 1,
        "is_active": true,
        "createdAt": "2026-07-06T12:00:00.000Z",
        "updatedAt": "2026-07-06T12:00:00.000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "total": 7,
      "totalPages": 1
    }
  }
}
```

**Key Fields:**
- `documentId`: Use this for relationships (not `id`, which changes per locale)
- `slug`: Use for URL-friendly queries
- `attributes`: Actual field data

---

## Step 5: Query Examples (for Flutter)

### Get All Premium Categories

```bash
curl "http://localhost:1337/api/premium-categories?populate=*"
```

### Get Active Training Categories

```bash
curl "http://localhost:1337/api/training-categories?filters[is_active][\$eq]=true&sort=display_order:asc"
```

### Get Training Tracks for Cultural Experience

```bash
curl "http://localhost:1337/api/training-tracks?filters[applicable_launchpad_tracks][\$contains]=cultural_experience&populate=*"
```

### Pagination

```bash
# Page 2, 10 items per page
curl "http://localhost:1337/api/training-tracks?pagination[page]=2&pagination[pageSize]=10"
```

### Locale Specific (if i18n enabled)

```bash
# Thai content
curl "http://localhost:1337/api/premium-categories?locale=th"

# Malay content
curl "http://localhost:1337/api/premium-categories?locale=ms"
```

---

## Troubleshooting

### Script fails: "Cannot connect to Strapi"
- Make sure `npm run develop` is running in another terminal
- Check Strapi is accessible at http://localhost:1337
- Wait 10 seconds after starting dev server

### API returns empty arrays
- Seed data hasn't been created yet: run `npm run seed:pillars`
- Check Strapi admin: http://localhost:1337/admin
- Manually create test data via UI

### API returns 403 Forbidden
- Check permissions in Strapi Admin: Settings > Roles > Public
- Public role needs "find" and "findOne" permissions for endpoints
- Configure in Settings > Roles

### Field labels still show snake_case
- Run field label fix: `npm run apply:labels`
- Hard refresh admin: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Restart Strapi dev server

---

## Next Steps After Phase 2

Once seed data and API testing are working:

1. **Phase 3: Flutter Integration**
   - Create Dart models for each collection
   - Update data layer to consume Strapi endpoints
   - Wire up UI to display content

2. **Create More Test Data**
   - Add sample training partners/institutions
   - Add test instructors
   - Create sample training tracks
   - Add training sessions

3. **Configure Permissions**
   - Set public read-only access
   - Configure authenticated endpoints
   - Sanitize vendor data

4. **Localization Testing**
   - Create Thai/Malay translations
   - Test locale switching

---

## Files Used

- `scripts/seed-7-pillars.js` — Populates taxonomy
- `scripts/test-api-endpoints.sh` — Tests all endpoints
- `scripts/apply-view-labels.js` — Fixes field name display (from Phase 1)

## Commands Reference

```bash
npm run develop              # Start dev server
npm run seed:pillars        # Seed 7 Pillars
npm run apply:labels        # Fix field labels
./scripts/test-api-endpoints.sh local    # Test local API
./scripts/test-api-endpoints.sh cloud    # Test cloud API
npm run build               # Build for production
npm run start               # Start prod server
```
