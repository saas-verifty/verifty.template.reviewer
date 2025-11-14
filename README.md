# Verifty Template Reviewer

A modern React + TypeScript template project with comprehensive development tooling, testing infrastructure, and CI/CD automation.

## Features

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Feature-based architecture** for scalability
- **ESLint & Prettier** for code quality
- **Jest & React Testing Library** for testing
- **GitHub Actions** CI/CD pipeline
- **Pre-commit hooks** with Husky and lint-staged
- **Corporate email validation** for governance
- **API client** with Axios interceptors

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd verifty.template.reviewer

# Install dependencies
npm install

# Set up pre-commit hooks
npm run prepare
```

### Configure Git Email (Required)

This project requires commits to use a @verifty.com email address:

```bash
git config user.email your.name@verifty.com
```

## Available Scripts

### Development

```bash
# Start development server (http://localhost:3000)
npm run dev
```

### Building

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Check formatting
npm run format:check

# TypeScript type checking
npm run typecheck
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Project Structure

```
verifty.template.reviewer/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
├── public/
│   └── index.html              # HTML template
├── scripts/
│   └── check-email.sh          # Email validation script
├── src/
│   ├── api/
│   │   ├── client.ts           # Axios client configuration
│   │   └── endpoints.ts        # API endpoint definitions
│   ├── features/
│   │   └── example/
│   │       ├── components/     # Feature components
│   │       ├── hooks/          # Feature hooks
│   │       ├── pages/          # Feature pages
│   │       ├── services/       # Feature services
│   │       └── types/          # Feature TypeScript types
│   ├── components/             # Shared components
│   ├── hooks/                  # Shared hooks
│   ├── utils/                  # Utility functions
│   ├── styles/                 # Global styles
│   ├── tests/                  # Test setup and utilities
│   ├── App.tsx                 # Main App component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles
├── .eslintrc.js                # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── .pre-commit-config.yaml     # Pre-commit hooks
├── jest.config.js              # Jest configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── package.json                # Dependencies and scripts
```

## Development Guidelines

### Feature-Based Architecture

New features should follow this structure:

```
src/features/your-feature/
├── components/          # Feature-specific components
├── hooks/              # Feature-specific hooks
├── pages/              # Feature pages
├── services/           # API services
└── types/              # TypeScript types
```

### Path Aliases

Use the `@/` alias to import from the `src` directory:

```typescript
import { apiClient } from '@/api/client'
import { ExamplePage } from '@/features/example/pages/ExamplePage'
```

### API Integration

Configure the API base URL via environment variable:

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:3001/api
```

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration:

1. **Email Validation** - Ensures all commits use @verifty.com emails
2. **Type Checking** - Validates TypeScript types
3. **Linting** - Runs ESLint
4. **Formatting** - Checks Prettier formatting
5. **Testing** - Runs Jest tests
6. **Building** - Creates production build

All checks must pass before merging to `main`.

## Pre-commit Hooks

Pre-commit hooks automatically run on every commit:

- Corporate email validation
- TypeScript type checking
- ESLint linting
- Prettier formatting

To bypass hooks (not recommended):

```bash
git commit --no-verify
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## License

Copyright © 2024 Verifty. All rights reserved.
