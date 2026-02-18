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
cp backend/pkg/retirement_core.d.ts frontend/src/lib/
```

## Step 2: Gather Changes

```bash
git diff main...HEAD --stat
git log main...HEAD --oneline
```

## Step 3: Determine Labels

Based on changed files, determine appropriate labels:
- `frontend` label if any files in `frontend/src/`
- `backend` label if any files in `backend/src/`
- `wasm` label if WASM-related changes
- `ci-cd` label if `.github/workflows/` or `.opencode/` changed
- `documentation` label if `README.md`, `AGENTS.md`, or `*.md` changed

## Step 4: Generate Description

Include:
- **Summary**: What and why
- **Changes**: By area (frontend, backend, infra)
- **Testing**: How to verify locally
- **Checklist**: typecheck, lint, tests, WASM if applicable

## Step 5: Create PR

Create PR with auto-assignment and labels:
```bash
gh pr create \
  --title "<title>" \
  --body "<description>" \
  --assignee "@me" \
  --label "<determined-labels>"
```

After creation, note the PR URL for review.
