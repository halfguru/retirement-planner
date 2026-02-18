---
description: Full feature workflow - explore, plan, build, validate, PR
agent: build
---

# Feature: $ARGUMENTS

Follow this workflow systematically.

## Phase 1: Explore

1. Read AGENTS.md for project conventions
2. Load relevant skills:
   - `/skill react-component` for UI work
   - `/skill wasm-workflow` for Rust/WASM work
3. Explore existing patterns in relevant directories

## Phase 2: Plan

1. List files to create or modify
2. Define component/function structure
3. Outline types needed
4. Describe the user/developer flow
5. **Ask for approval before building**

## Phase 3: Build

Implement the feature, following project conventions.

If WASM changes are needed:
```bash
cd backend && wasm-pack build --target web
cp backend/pkg/retirement_core_bg.wasm frontend/public/wasm/
cp backend/pkg/retirement_core.js frontend/src/lib/
cp backend/pkg/retirement_core_bg.wasm.d.ts frontend/src/lib/retirement_core.d.ts
```

## Phase 4: Validate

Run validation checks:
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `cd backend && cargo clippy && cargo test` (if WASM changed)

Fix issues before proceeding.

## Phase 5: PR

Run `/prepare-pr` when ready.

---

**Implementing:** $ARGUMENTS
