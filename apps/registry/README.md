# BLAH Registry

A robust, scalable public registry for compute functions and tools, allowing developers to publish, share, and consume functions with versioning and flexible execution options.

## Features

- **Public Registry**: Browse, search, and discover compute functions and tools
- **Multi-Provider Execution**: Configure different execution providers (Cloudflare Workers, Vercel Functions)
- **Versioning & Dependencies**: Manage versions and dependencies similar to npm
- **User Authentication**: Secure login and API key management
- **Tool Metadata**: Rich metadata for discoverability and usage information

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon PostgreSQL account)
- Vercel account (for deployment)

### Local Development

1. Clone the repository
2. Install dependencies:
```bash
cd apps/registry
npm install
```

3. Copy `.env.example` to `.env` and update with your Neon PostgreSQL URL:
```bash
cp .env.example .env
```

4. Run the initial Prisma migration:
```bash
node prisma/migrate.js
```

5. Generate the Prisma client:
```bash
npm run prisma:generate
```

6. Start the development server:
```bash
npm run dev
```

7. Initialize the database with default providers:
```bash
curl -X GET http://localhost:3000/api/db-init \
  -H "Authorization: Bearer YOUR_ADMIN_API_KEY"
```

### Database Schema Management

The application uses Prisma ORM to manage the database schema:

- View database schema: `npm run prisma:studio`
- Create a new migration: `npm run prisma:migrate`

### Deployment

This application is designed to be deployed on Vercel with a Neon PostgreSQL database.

1. Create a new project on Vercel
2. Link your GitHub repository
3. Configure the environment variables in the Vercel dashboard:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `NEXTAUTH_URL`: Your deployment URL
   - `NEXTAUTH_SECRET`: A secure random string for session encryption
   - `ADMIN_API_KEY`: A secure random string for admin API access
4. Deploy the application

## API Routes

### Authentication
- **POST /api/register**: Register a new user
- **POST /api/auth/[...nextauth]**: NextAuth.js authentication endpoints

### Tools
- **GET /api/tools**: List all tools or search with query parameters
- **GET /api/tools/:id**: Get a specific tool
- **GET /api/tools/:id/versions/:version**: Get a specific tool version
- **POST /api/publish**: Publish a new tool or tool version

### API Keys
- **GET /api/api-keys**: List all API keys for the authenticated user
- **POST /api/api-keys**: Create a new API key
- **DELETE /api/api-keys/:id**: Delete an API key

### Database Administration
- **GET /api/db-init**: Initialize the database with default providers (requires admin API key)

## Database Schema

The application uses a PostgreSQL database with the following main tables managed by Prisma:
- `users`: User accounts
- `tools`: Tool metadata
- `tool_versions`: Versions of tools
- `tool_provider_configs`: Provider-specific configuration
- `tags`: Tool tags for categorization
- `api_keys`: API keys for programmatic access

## Integration with BLAH CLI

This registry is designed to work with the BLAH CLI:

```bash
# Install a tool
blah tool install tool-name

# Publish a tool
blah registry publish
```

## License

[MIT](LICENSE)

## Status

This project is currently in "EXTREME POC MODE" and is being actively developed. The core functionality is being implemented with Prisma ORM and Neon PostgreSQL.