# Heritage CMS - Quick Start

**Implementation Status:** Ready to Build
**Estimated Time:** 4-6 hours
**Target:** Production-ready Strapi v5 CMS with 7 Pillars taxonomy

---

## What We're Building

A complete heritage tourism and training CMS with:
- **9 Collections** (categories, content, people, organizations)
- **7 Shared Components** (location, pricing, SEO, etc.)
- **7 Pillars Taxonomy** (pre-seeded cultural heritage framework)
- **Multi-language Support** (EN, TH, MS, ID)
- **Privacy Protection** (sanitized vendor API)
- **v5 Compatibility** (Strapi Cloud ready)

---

## Collections Overview

**Categories:**
1. Premium Category (marketplace experiences)
2. Training Category (vendor education)

**People & Organizations:**
3. Training Partner (universities, institutions)
4. Instructor (teachers, experts)
5. Vendor (heritage businesses)
6. Content Creator (your staff, contributors)

**Content:**
7. Premium Content (customer experiences)
8. Training Track (vendor courses)
9. Training Session (course modules)

**Supporting:**
10. Tag (cross-cutting metadata)

---

## Critical Requirements

✅ **Strapi v5 Document Service API** - seed scripts must use `strapi.documents()`
✅ **Vendor Privacy** - custom controller to sanitize public API
✅ **i18n Plugin** - multi-language for regional content
✅ **Explicit Population** - no `populate=*`, use specific queries
✅ **Rich Text Fields** - use `richtext` type, not `text`
✅ **Singular Display Names** - Strapi auto-pluralizes endpoints

---

## Next Steps

1. **Read:** `01-heritage-cms-implementation.md` (complete specs)
2. **Start:** Phase 1 - Cleanup old blog template
3. **Build:** Create schemas following phase order
4. **Test:** Local verification before Cloud deploy
5. **Deploy:** Push to Git → auto-deploy to Strapi Cloud

---

## Files to Create

📄 `01-heritage-cms-implementation.md` - Full implementation guide ✅
📁 `src/api/*` - 10 collection schemas (to be created)
📁 `src/components/shared/*` - 7 component schemas (to be created)
📄 `scripts/seed-categories.js` - 7 Pillars seed data (to be created)
📄 Custom controllers for Vendor + Content Creator (to be created)

---

**Ready when you are!**
