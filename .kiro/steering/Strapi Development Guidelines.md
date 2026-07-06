# Strapi Development Guidelines

## Project Overview

This is the Strapi CMS backend for BaseApp, deployed to Strapi Cloud at:
- **URL**: https://positive-acoustics-345fa51dc4.strapiapp.com/api
- **GitHub**: https://github.com/baseap/strapi-baseapp
- **Deployment**: Auto-deploys from GitHub to Strapi Cloud

## Architecture

### Relationship with Flutter App
- BaseApp (Flutter) is the client application in `/Users/macbook/Documents/BaseApp`
- strapi-baseapp (this project) is the headless CMS providing content via REST API
- Communication: Flutter app → Supabase Edge Function (strapi-proxy) → Strapi Cloud API
- The edge function handles authentication using STRAPI_TOKEN stored in Supabase Secrets

### Content Types
Currently defined:
- Training content (courses, sessions, modules, pages, instructors)
- Blog content (articles, authors, categories, global, about)

Need to add:
- Products (marketplace items)
- Services (bookable services)
- Activities (experiences)
- Health Programs (wellness content)

## Development Workflow

### Making Changes
1. Work on content types locally in this folder
2. Test locally with `npm run develop` (starts Strapi admin at http://localhost:1337)
3. Commit and push to GitHub
4. Strapi Cloud auto-deploys changes
5. Update Flutter app to consume new endpoints

### Creating Content Types
Use Strapi CLI or admin panel:
```bash
npm run strapi generate
```

Structure for each content type:
```
src/api/{content-type}/
  ├── content-types/{content-type}/
  │   └── schema.json          # Field definitions
  ├── controllers/
  │   └── {content-type}.js    # Custom logic
  ├── routes/
  │   └── {content-type}.js    # API routes
  └── services/
      └── {content-type}.js    # Business logic
```

### Schema Design Principles
- Use `relation` fields for associations (e.g., product → vendor)
- Use `component` for reusable structures (e.g., pricing, location)
- Use `dynamiczone` for flexible content areas
- Use `media` for images/files (stored in Strapi's upload provider)
- Add validation rules in schema.json
- Set default values where appropriate

### API Configuration
- Configure permissions in `Settings > Roles > Public` in Strapi admin
- Default: all endpoints are private
- Expose only necessary fields to public API
- Use authenticated endpoints for sensitive operations

## Integration with Flutter App

### Current Pattern
Flutter app uses this pattern for Strapi content:
1. Repository in domain layer (e.g., `AdminTrainingDomainRepository`)
2. Use cases for specific operations (e.g., `GetStrapiCoursesUseCase`)
3. Data sources call Supabase edge function
4. Edge function proxies to Strapi API with authentication

### API Response Format
Strapi v4 returns data in this structure:
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Example",
      "content": "...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "meta": {}
}
```

Collections return:
```json
{
  "data": [ /* array of items */ ],
  "meta": {
    "pagination": { "page": 1, "pageSize": 25, "total": 100 }
  }
}
```

### Flutter Models
Create corresponding Dart models with:
- `fromJson` factory for API deserialization
- Handle nested relations
- Map media URLs correctly
- Parse dates properly

## Environment Variables

### Local Development (.env)
```
HOST=0.0.0.0
PORT=1337
APP_KEYS=<generated>
API_TOKEN_SALT=<generated>
ADMIN_JWT_SECRET=<generated>
TRANSFER_TOKEN_SALT=<generated>
JWT_SECRET=<generated>
```

### Strapi Cloud
Environment variables are managed in Strapi Cloud dashboard.

## Key Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run develop

# Build for production
npm run build

# Start production server
npm run start

# Generate content type
npm run strapi generate

# Export data
npm run strapi export

# Import data
npm run strapi import
```

## File Locations

### Configuration
- `config/database.js` - Database connection (SQLite local, PostgreSQL prod)
- `config/server.js` - Server settings
- `config/plugins.js` - Plugin configuration
- `config/middlewares.js` - Middleware stack
- `config/api.js` - API settings

### Content Types
- `src/api/*` - All content type definitions
- `src/components/*` - Reusable components
- `types/generated/*` - Auto-generated TypeScript types

### Data
- `data/data.json` - Exported content data
- `public/uploads/*` - Uploaded media files (local only)
- `database/migrations/*` - Database migrations

## Best Practices

### Content Modeling
- Design content types based on Flutter app features
- Keep schemas simple initially, iterate as needed
- Use components for shared field groups
- Avoid deep nesting (max 2-3 levels)
- Plan for localization if needed (add `i18n` plugin)

### API Design
- Use population (`?populate=*`) carefully to avoid over-fetching
- Implement pagination for large collections
- Add filters for common queries
- Consider caching for frequently accessed content
- Version APIs if making breaking changes

### Security
- Never commit `.env` with real secrets
- Use API tokens for programmatic access
- Configure CORS properly in `config/middlewares.js`
- Set appropriate role permissions
- Validate input in controllers

### Performance
- Use database indexes for frequently queried fields
- Implement caching at edge function level
- Optimize media (resize, compress before upload)
- Use CDN for media delivery
- Monitor API response times in Strapi Cloud dashboard

## Common Tasks

### Adding a New Content Type for Flutter App

1. **Plan the schema** - List fields needed by Flutter feature
2. **Generate content type** - `npm run strapi generate`
3. **Define schema** - Edit `schema.json` with fields, validations, relations
4. **Configure permissions** - Enable public read access in Strapi admin
5. **Create seed data** - Add sample content via admin panel
6. **Test API** - `GET /api/{content-type}?populate=*`
7. **Create Flutter model** - Dart class with `fromJson`
8. **Create repository** - Domain layer interface
9. **Create use case** - Business logic for fetching
10. **Update data source** - Call edge function
11. **Update BLoC/Cubit** - State management
12. **Build UI** - Display in Flutter widgets

### Syncing Local and Cloud

1. Export from cloud: Download data via admin panel
2. Import locally: `npm run strapi import -f data/export.tar.gz`
3. Make changes locally
4. Push to GitHub
5. Strapi Cloud auto-deploys

## Troubleshooting

### Local server won't start
- Check `.env` has all required keys
- Delete `.cache` and `build` folders
- Run `npm install` again

### API returns 403 Forbidden
- Check permissions in Strapi admin (Settings > Roles)
- Verify API token if using authenticated requests
- Check CORS configuration

### Changes not appearing in Flutter app
- Verify Strapi Cloud deployed latest commit (check dashboard)
- Clear Supabase edge function cache
- Check Flutter app is hitting correct URL
- Verify `STRAPI_TOKEN` in Supabase Secrets is valid

### Media uploads not working
- Check upload plugin configuration in `config/plugins.js`
- Verify file size limits
- Check storage provider settings (local vs cloud)

## Resources

- [Strapi Documentation](https://docs.strapi.io)
- [Strapi REST API](https://docs.strapi.io/dev-docs/api/rest)
- [Strapi Cloud](https://cloud.strapi.io)
- [Content Type Builder](https://docs.strapi.io/user-docs/content-type-builder)
