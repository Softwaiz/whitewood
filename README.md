# Whitewood

Whitewood is a blogging platform generator that enables fast blog creation and deployment. It separates **layout** (block-based editing via Puck) from **content** (rich text via Lexical), giving you full control over both structure and prose.

Deploys to **Cloudflare Workers** with a single command.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Cloudflare Workers |
| Framework | RedwoodSDK (React Server Components) |
| Frontend | React 19, Vite 7 |
| Styling | Tailwind CSS 4, shadcn/ui |
| Database | Cloudflare D1 (SQLite) |
| ORM | Drizzle ORM |
| File Storage | Cloudflare R2 |
| Block Editor | Puck |
| Rich Text | Lexical |
| Validation | Zod |
| Auth | Google OAuth, bcrypt |

## Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 9 (this project uses pnpm, not npm)
- A **Cloudflare account** (free tier works)
- **Wrangler CLI**: `pnpm add -g wrangler`

## Getting Started

```shell
# Clone the repository
git clone <repo-url> whitewood
cd whitewood/app

# Install dependencies
pnpm install

# Generate Worker types (run after every env change)
pnpm generate

# Create your D1 database (first time only)
npx wrangler d1 create whitewood-db

# Update wrangler.jsonc with the returned database_id, then:

# Run migrations locally
pnpm migrate:dev

# Start the dev server
pnpm dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Environment Variables

Copy `.env.local` and fill in the values:

| Variable | Required | Description |
|---|---|---|
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth client secret |
| `GOOGLE_RETURN_URL` | Optional | OAuth callback URL (defaults to `/auth/google`) |

Cloudflare bindings are configured in `wrangler.jsonc`:

| Binding | Type | Purpose |
|---|---|---|
| `DATABASE` | D1 | Primary database |
| `MEDIA_BUCKET` | R2 | Media / file storage |
| `PASSWORD_WORK_FACTOR` | Var | bcrypt cost factor (default: 12) |

## Database Setup

```shell
# Generate a new migration after schema changes
pnpm migrate:new

# Apply migrations locally
pnpm migrate:dev

# Apply migrations to production
pnpm migrate:prod
```

Migrations live in the `drizzle/` directory. The schema is defined in `src/db/schema.ts`.

## R2 Bucket Setup

```shell
# Create the media bucket
npx wrangler r2 bucket create whitewood-media
```

The bucket binding is already configured in `wrangler.jsonc` as `MEDIA_BUCKET`.

## Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview the production build locally |
| `pnpm release` | Clean, build, and deploy to Cloudflare Workers |
| `pnpm generate` | Generate TypeScript types from `wrangler.jsonc` |
| `pnpm types` | Run `tsc` type checking |
| `pnpm check` | Generate types + type check |
| `pnpm migrate:new` | Generate a new Drizzle migration |
| `pnpm migrate:dev` | Apply D1 migrations locally |
| `pnpm migrate:prod` | Apply D1 migrations to production |
| `pnpm clean` | Remove build artifacts |

## Project Structure

```
app/
├── src/
│   ├── worker.tsx              # Worker entry point & route definitions
│   ├── client.tsx              # Client entry
│   ├── app/                    # Application shell (pages, routes, styles)
│   │   ├── pages/              # Public-facing pages
│   │   ├── routes/             # Public route handlers (sitemap, media)
│   │   └── styles.css          # Global styles
│   ├── platform/               # Platform (admin) layer
│   │   ├── @resolvers/         # Data access layer (PostResolver, UserResolver, etc.)
│   │   ├── api/                # serverAction endpoints
│   │   ├── blog/               # Blog-specific utilities
│   │   ├── components/         # Platform UI components
│   │   ├── contexts/           # React contexts
│   │   ├── hooks/              # Platform hooks
│   │   ├── layouts/            # Layout components (ProtectedLayout)
│   │   ├── middleware/         # Auth middleware
│   │   ├── routes/             # Platform page routes
│   │   ├── schemas/            # Zod validation schemas
│   │   └── utils/              # Platform utilities
│   ├── components/             # Shared UI components
│   │   └── ui/                 # shadcn/ui components
│   ├── db/                     # Database layer
│   │   ├── schema.ts           # Drizzle schema definitions
│   │   └── db.ts               # Database client
│   ├── hooks/                  # Shared React hooks
│   └── lib/                    # Shared utilities (auth, utils)
├── drizzle/                    # Drizzle migration files
├── public/                     # Static assets (favicons)
├── types/                      # Additional type declarations
├── wrangler.jsonc              # Cloudflare Workers config
├── drizzle.config.ts           # Drizzle Kit config
├── vite.config.mts             # Vite config
└── tsconfig.json               # TypeScript config
```

## Architecture

### Layout vs Content

Whitewood enforces a strict separation of concerns:

- **Puck** manages **layout and structure** — blocks define *where* things go.
- **Lexical** manages **rich text content** — text, formatting, links inside blocks.

Blocks must not implement their own rich text system, and content editors must not manage layout.

### Queries vs Actions

Server logic follows the RedwoodSDK pattern:

- **`serverQuery`** — Read-only data fetching. Returns data, no UI re-render. Must be idempotent.
- **`serverAction`** — Writes (create, update, delete). Triggers UI re-render. Must validate input with Zod.

Never mix reads and writes in the same function.

### Data Model

- **Organizations** — Top-level tenant
- **Users** — Belong to an organization, have roles (`root`, `member`)
- **Posts** — Articles with title, content, slug, publish status
- **Collections** — Categories for organizing posts (many-to-many)
- **Media** — Files stored in R2

### Authentication

- Password-based login with bcrypt
- Google OAuth (optional, requires Google Cloud credentials)
- Role-based access: `root` users can manage users and collections; `member` users can create and edit posts

## Deployment

```shell
# Deploy to Cloudflare Workers
pnpm release
```

This runs `clean → build → wrangler deploy`. Make sure your `wrangler.jsonc` is configured with the correct `database_id` and bucket name for production.

Before first deployment:
1. Create a production D1 database: `npx wrangler d1 create whitewood-db`
2. Update `wrangler.jsonc` with the production database ID
3. Create a production R2 bucket: `npx wrangler r2 bucket create whitewood-media`
4. Run migrations: `pnpm migrate:prod`

## First-Time Setup

When you first visit `/platform/setup`, you'll be prompted to create your organization and root user account. This is the initial setup flow for new deployments.

---

For detailed agent instructions and conventions, see [AGENTS.md](./AGENTS.md).
