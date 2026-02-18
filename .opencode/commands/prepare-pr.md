---
description: Prepare PR with WASM validation and description
agent: build
---

# Prepare Pull Request

## Step 1: Check WASM

If `backend/src/` changed, verify WASM artifacts are current:
```bash
cd backend && wasm-pack build --target web
cp backend/pkg/retirement_core_bg.wasm frontend/public/wasm/
cp backend/pkg/retirement_core.js frontend/src/lib/
cp backend/pkg/retirement_core_bg.wasm.d.ts frontend/src/lib/retirement_core.d.ts
```

## Step 2: Gather Changes

```bash
git diff main...HEAD --stat
git log main...HEAD --oneline
```

## Step 3: Generate Description

Include:
- **Summary**: What and why
- **Changes**: By area (frontend, backend, infra)
- **Testing**: How to verify locally
- **Checklist**: typecheck, lint, tests, WASM if applicable

## Step 4: Create PR

Output the command:
```bash
gh pr create --title "<title>" --body "<description>"
```
