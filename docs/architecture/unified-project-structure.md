# Unified Project Structure

```
racha-ai/
├── .github/                    # CI/CD workflows
│   └── workflows/
│       ├── ci.yml              # Test and build
│       ├── deploy-staging.yml  # Staging deployment
│       └── deploy-prod.yml     # Production deployment
├── apps/                       # Application packages
│   └── web/                    # Next.js frontend + API
│       ├── src/
│       │   ├── app/            # App Router pages
│       │   │   ├── (auth)/     # Auth pages
│       │   │   ├── (dashboard)/ # Main app pages
│       │   │   ├── api/        # API routes
│       │   │   ├── globals.css
│       │   │   └── layout.tsx
│       │   ├── components/     # React components
│       │   │   ├── ui/         # Basic UI (shadcn/ui)
│       │   │   ├── conversation/
│       │   │   ├── division/
│       │   │   ├── group/
│       │   │   └── auth/
│       │   ├── hooks/          # Custom React hooks
│       │   ├── services/       # API client services
│       │   ├── stores/         # Zustand state management
│       │   ├── middleware/     # API middleware
│       │   ├── utils/          # Utilities
│       │   └── types/          # TypeScript types
│       ├── public/             # Static assets
│       ├── tests/              # Frontend tests
│       ├── next.config.js
│       ├── tailwind.config.js
│       └── package.json
├── packages/                   # Shared packages
│   ├── shared/                 # Shared types/utilities
│   │   ├── src/
│   │   │   ├── types/          # Shared TypeScript interfaces
│   │   │   ├── constants/      # Brazilian constants (currencies, etc.)
│   │   │   ├── utils/          # Shared utility functions
│   │   │   └── validation/     # Zod schemas
│   │   └── package.json
│   ├── ui/                     # Shared UI components
│   │   ├── src/
│   │   │   ├── components/     # Reusable components
│   │   │   └── styles/         # Shared styles
│   │   └── package.json
│   └── config/                 # Shared configuration
│       ├── eslint/             # ESLint config
│       ├── typescript/         # TypeScript config
│       ├── tailwind/           # Tailwind config
│       └── jest/               # Jest config
├── infrastructure/             # Infrastructure as Code
│   ├── terraform/              # AWS resources for Brazilian regions
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── scripts/                # Deployment scripts
├── scripts/                    # Monorepo management scripts
│   ├── build.sh
│   ├── test.sh
│   └── deploy.sh
├── docs/                       # Documentation
│   ├── prd.md
│   ├── architecture.md
│   ├── api-documentation.md
│   └── lgpd-compliance.md
├── .env.example                # Environment template
├── .gitignore
├── package.json                # Root package.json with workspaces
├── turbo.json                  # Turborepo configuration
├── README.md                   # Project README with Brazilian setup
└── LICENSE
``` 