# Development Workflow

## Local Development Setup

### Prerequisites

```bash
# Install Node.js (LTS version)
curl -fsSL https://fnm.vercel.app/install | bash
fnm install 20.10.0
fnm use 20.10.0

# Install pnpm for monorepo management
npm install -g pnpm

# Install Turborepo globally
npm install -g turbo
```

### Initial Setup

```bash
# Clone repository
git clone https://github.com/your-org/racha-ai.git
cd racha-ai

# Install all dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Set up Supabase (Brazilian region)
pnpm supabase:setup

# Run database migrations
pnpm db:migrate

# Seed with Brazilian test data
pnpm db:seed
```

### Development Commands

```bash
# Start all services (frontend + API)
pnpm dev

# Start frontend only
pnpm dev:web

# Start API development server only
pnpm dev:api

# Run tests
pnpm test          # All tests
pnpm test:unit     # Unit tests only
pnpm test:e2e      # E2E tests only
pnpm test:watch    # Watch mode

# Build for production
pnpm build

# Lint and format
pnpm lint
pnpm format

# Type checking
pnpm type-check

# Clean build artifacts
pnpm clean
```

## Environment Configuration

### Required Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://racha-ai.vercel.app

# Backend (.env)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-claude-api-key
REDIS_URL=redis://localhost:6379

# Shared
DATABASE_URL=postgresql://user:pass@localhost:5432/racha_ai
ENVIRONMENT=development
LOG_LEVEL=debug

# Brazilian-specific
TIMEZONE=America/Sao_Paulo
CURRENCY=BRL
LOCALE=pt-BR

# LGPD Compliance
DATA_RETENTION_DAYS=90
DPO_EMAIL=dpo@racha-ai.com.br
PRIVACY_POLICY_URL=https://racha-ai.com.br/privacy
``` 