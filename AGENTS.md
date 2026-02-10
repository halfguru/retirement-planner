# AGENTS.md

This file guides agentic coding agents working on the retirement planning app.

## Build Commands

### Frontend (React + TypeScript)
- `npm install` - Install dependencies
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm test` - Run all tests
- `npm test -- --watch` - Watch mode
- `npm test -- path/to/test.test.tsx` - Run single test file
- `npm test -- -t "test name"` - Run tests matching name

### Rust Core (WASM)
- `cd backend && cargo build` - Build Rust code
- `cd backend && cargo build --release` - Optimize for production
- `cd backend && cargo test` - Run Rust tests
- `cd backend && cargo test test_name` - Run single test
- `cd backend && cargo clippy` - Lint Rust code
- `cd backend && cargo fmt` - Format Rust code
- `cd backend && wasm-pack build --target web` - Build WASM package (run from root: `cd backend && wasm-pack build --target web`)
- After building WASM: `cp backend/pkg/retirement_core_bg.wasm frontend/public/wasm/` - Copy WASM to frontend
- After building WASM: `cp backend/pkg/retirement_core.js frontend/src/lib/ && cp backend/pkg/retirement_core_bg.wasm.d.ts frontend/src/lib/financial_math_wasm.d.ts` - Copy JS bindings to frontend
- Note: All copy commands should be run from project root directory

## Project Structure

```
retirement-planner/
├── frontend/                 # React + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── charts/          # Recharts visualization components
│   │   ├── lib/             # Utilities and WASM wrappers
│   │   └── types/           # TypeScript type definitions
│   ├── public/
│   │   └── wasm/            # Compiled WASM binaries
│   └── package.json
└── backend/                  # Rust core (compiled to WASM)
    ├── src/
    │   ├── calculations.rs    # Financial math logic
    │   ├── models.rs         # Data structures
    │   └── lib.rs           # WASM exports
    ├── pkg/                  # wasm-pack output (don't edit)
    └── Cargo.toml
```

## Code Style Guidelines

### Import Organization
- Group imports: React/external libs, internal components, types, styles
- Use absolute imports from `@/` for internal modules
- Example:
  ```ts
  import React from 'react'
  import { LineChart } from 'recharts'
  import { RetirementProjection } from '@/types'
  import { calculateHouseholdSavings } from '@/core/calculations'
  ```

### TypeScript Conventions
- Use `interface` for object shapes, `type` for unions/aliases
- Be explicit with return types on exported functions
- Use `readonly` for immutable arrays
- Avoid `any` - prefer `unknown` with type guards
- Use enums sparingly; prefer literal unions when values are strings

### Rust Conventions
- Follow `rustfmt` formatting (run `cargo fmt` before committing)
- Use `cargo clippy` for linting
- Prefer idiomatic Rust patterns over JavaScript-style code
- Use `Result<T, E>` for fallible operations
- Define domain-specific error types with `thiserror`
- Document public APIs with `///`

### Naming Conventions
- Components: PascalCase (`RetirementDashboard.tsx`)
- Functions: camelCase (`calculateAnnualSavings`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETIREMENT_AGE`)
- Types/interfaces: PascalCase (`HouseholdConfig`)
- Test files: `.test.tsx` or `.spec.tsx` suffix
- Test files mirror source structure: `src/components/__tests__/Dashboard.test.tsx`
- Rust structs: PascalCase (`HouseholdConfig`)
- Rust functions: snake_case (`calculate_annual_savings`)

### React/JSX Style
- Functional components with hooks only
- Use TypeScript for all props: `interface Props { ... }`
- Destructure props at component top
- Prefer explicit event handlers over inline arrow functions
- Keep components under 300 lines; extract subcomponents

### Styling (Tailwind CSS)
- Use utility classes over custom CSS
- Prefer design system values: `text-neutral-700` over `text-gray-500`
- Use `@apply` only in component-scoped files
- Mobile-first responsive design: `md:`, `lg:` prefixes

## Error Handling

### Frontend
- Validate user inputs with Zod or similar
- Display errors in context (near inputs, not alerts)
- Use error boundaries for component-level crashes
- Log errors to console with context

### Rust Core
- Use `Result<T, E>` for fallible operations
- Define domain-specific error types with `thiserror`
- Propagate errors with `?` operator; context with `.context()`
- Write tests covering error branches

## GitHub Actions

### CI Pipeline (`.github/workflows/ci.yml`)
- Runs on push/PR to `main` and `develop` branches
- **Frontend**: Type check, lint, build
- **Backend**: Tests, clippy lint, format check, WASM build

### Build Pipeline (`.github/workflows/build.yml`)
- Runs on version tags (`v*`)
- Builds WASM and frontend
- Uploads `frontend/dist` as artifacts for deployment

## Testing Principles

- Test financial calculations in Rust; UI integration in React
- Write unit tests for core math functions
- Use deterministic inputs/outputs (no random values)
- Test edge cases: zero values, negative inputs, max ages
- Maintain 80%+ coverage on financial logic

## Philosophy Alignment

- Prioritize clarity over cleverness
- Comments should explain "why", not "what"
- Make math explicit and traceable
- Use conservative assumptions as defaults
- Use neutral, professional visuals and interactions
