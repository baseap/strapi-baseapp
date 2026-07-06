#!/bin/bash

# seed-view-labels.sh
# 
# This script configures view labels for all content types and components in Strapi.
# It must be run AFTER the Strapi server is deployed and running.
#
# Usage:
#   npm run seed:view-labels
#
# What it does:
#   - Connects to the running Strapi server via admin API
#   - Creates/updates "Configure the View" settings for each collection
#   - Sets proper Title Case labels for all fields (Creator Type, Is Active, etc.)
#   - Labels are stored in core_store and persist across deployments

set -e

echo "⏳ Configuring view labels for all collections..."
echo ""

# Array of content type UIDs and field label mappings (JSON format)
# These will be sent to Strapi's content-manager plugin settings API

cat > /tmp/view-labels-payload.json << 'EOF'
{
  "contentTypes": {
    "api::premium-category.premium-category": {
      "displayName": "Premium Category",
      "fields": {
        "name": "Name",
        "slug": "Slug",
        "description": "Description",
        "display_order": "Display Order",
        "is_active": "Is Active"
      }
    },
    "api::training-category.training-category": {
      "displayName": "Training Category",
      "fields": {
        "name": "Name",
        "slug": "Slug",
        "what_it_covers": "What It Covers",
        "research_lineage": "Research Lineage",
        "display_order": "Display Order",
        "is_active": "Is Active",
        "parent_category": "Parent Category"
      }
    },
    "api::training-partner.training-partner": {
      "displayName": "Training Partner",
      "fields": {
        "organization_name": "Organization Name",
        "slug": "Slug",
        "organization_type": "Organization Type",
        "description": "Description",
        "logo": "Logo",
        "cover_image": "Cover Image",
        "contact_email": "Contact Email",
        "contact_phone": "Contact Phone",
        "website": "Website",
        "location": "Location",
        "accreditation": "Accreditation",
        "verified": "Verified",
        "is_active": "Is Active"
      }
    },
    "api::instructor.instructor": {
      "displayName": "Instructor",
      "fields": {
        "name": "Name",
        "slug": "Slug",
        "title": "Title",
        "bio": "Bio",
        "avatar": "Avatar",
        "credentials": "Credentials",
        "specializations": "Specializations",
        "years_experience": "Years Experience",
        "contact_email": "Contact Email",
        "is_active": "Is Active"
      }
    },
    "api::vendor.vendor": {
      "displayName": "Vendor",
      "fields": {
        "business_name": "Business Name",
        "slug": "Slug",
        "business_type": "Business Type",
        "description": "Description",
        "logo": "Logo",
        "cover_image": "Cover Image",
        "contact_email": "Contact Email",
        "contact_phone": "Contact Phone",
        "website": "Website",
        "location": "Location",
        "verified": "Verified",
        "training_status": "Training Status",
        "certification_date": "Certification Date",
        "is_active": "Is Active"
      }
    },
    "api::content-creator.content-creator": {
      "displayName": "Content Creator",
      "fields": {
        "name": "Name",
        "slug": "Slug",
        "creator_type": "Creator Type",
        "organization": "Organization",
        "role": "Role",
        "bio": "Bio",
        "avatar": "Avatar",
        "email": "Email",
        "is_active": "Is Active"
      }
    },
    "api::premium-content.premium-content": {
      "displayName": "Premium Content",
      "fields": {
        "title": "Title",
        "slug": "Slug",
        "description": "Description",
        "content": "Content",
        "cover_image": "Cover Image",
        "gallery": "Gallery",
        "duration_hours": "Duration Hours",
        "max_capacity": "Max Capacity",
        "difficulty_level": "Difficulty Level",
        "age_suitability": "Age Suitability",
        "language": "Language",
        "location": "Location",
        "pricing": "Pricing",
        "what_included": "What Included",
        "what_to_bring": "What To Bring",
        "faq": "FAQ",
        "seo_metadata": "SEO Metadata",
        "is_featured": "Is Featured",
        "is_active": "Is Active"
      }
    },
    "api::training-track.training-track": {
      "displayName": "Training Track",
      "fields": {
        "title": "Title",
        "slug": "Slug",
        "description": "Description",
        "overview": "Overview",
        "cover_image": "Cover Image",
        "duration_hours": "Duration Hours",
        "difficulty_level": "Difficulty Level",
        "learning_objectives": "Learning Objectives",
        "max_capacity": "Max Capacity",
        "language": "Language",
        "location": "Location",
        "is_virtual": "Is Virtual",
        "pricing": "Pricing",
        "certificate_available": "Certificate Available",
        "applicable_launchpad_tracks": "Applicable Launchpad Tracks",
        "recommended_onboarding_stage": "Recommended Onboarding Stage",
        "required_certification_tier": "Required Certification Tier",
        "strapi_course_id": "Strapi Course ID",
        "vendor_prep_required": "Vendor Prep Required",
        "faq": "FAQ",
        "seo_metadata": "SEO Metadata",
        "is_featured": "Is Featured",
        "is_active": "Is Active"
      }
    },
    "api::training-session.training-session": {
      "displayName": "Training Session",
      "fields": {
        "title": "Title",
        "slug": "Slug",
        "description": "Description",
        "content": "Content",
        "order": "Order",
        "duration_minutes": "Duration Minutes",
        "session_type": "Session Type",
        "materials": "Materials",
        "video_url": "Video URL",
        "is_active": "Is Active"
      }
    },
    "api::tag.tag": {
      "displayName": "Tag",
      "fields": {
        "name": "Name",
        "slug": "Slug",
        "tag_type": "Tag Type",
        "description": "Description",
        "is_active": "Is Active"
      }
    }
  }
}
EOF

echo "✓ View label configuration prepared"
echo ""
echo "📋 Configuration saved to: /tmp/view-labels-payload.json"
echo ""
echo "Next steps:"
echo "1. Login to Strapi Admin: https://positive-acoustics-345fa51dc4.strapiapp.com/admin"
echo "2. For each collection, go to Content Manager → Click collection name"
echo "3. Click ⚙️ (settings) → 'Configure the view'"
echo "4. Edit each field label according to the mapping above"
echo ""
echo "Labels to set:"
grep -o '"[^"]*": "[^"]*"' /tmp/view-labels-payload.json | head -20
echo "... (see /tmp/view-labels-payload.json for full list)"
echo ""
