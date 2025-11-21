# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Verifty Template Reviewer - A React 18 + TypeScript application built with Vite for reviewing templates. Uses feature-based architecture.

## Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # TypeScript compile + Vite build
npm run preview          # Preview production build

# Quality
npm run lint             # ESLint
npm run format           # Prettier write
npm run typecheck        # TypeScript check (no emit)

# Testing
npm test                 # Run Jest tests
npm run test:watch       # Jest watch mode
npm run test:coverage    # Jest with coverage
```

## Architecture

### Feature-Based Structure
```
src/features/<feature-name>/
├── components/    # Feature UI components
├── hooks/         # Feature hooks
├── pages/         # Feature pages
├── services/      # API services
├── types/         # TypeScript types
├── constants/     # Feature constants
└── utils/         # Feature utilities
```

### Path Alias
Use `@/` for imports from `src/`:
```typescript
import { apiClient } from '@/api/client'
```

### API Configuration
- Base URL via `VITE_API_BASE_URL` env variable
- Axios client in `src/api/client.ts`

## Code Standards

- Strict TypeScript mode - avoid `any`
- Prefer named exports over default exports
- Use functional components with hooks
- Minimum 70% test coverage
- Follow AAA pattern in tests (Arrange, Act, Assert)

## Git Requirements

- Commits must use @verifty.com email: `git config user.email your.name@verifty.com`
- Main branch (`trunk`) is protected - use PRs
- Pre-commit hooks run: email validation, typecheck, lint, format

## Commit Format
```
<type>: <description>

Types: feat, fix, docs, style, refactor, test, chore
```
