---
description: Multi-specialist code review
agent: build
---

# Code Review

Analyze changes: `git diff main...HEAD`

Invoke reviewers based on changed files:

- **@review-frontend** - `.tsx`, `.ts`, `.css` files
- **@review-wasm** - `.rs` files
- **@review-infra** - `.yml`, workflow files

Synthesize into a prioritized report:

1. **Critical** - Must fix (bugs, security, breaking)
2. **Important** - Should fix (performance, best practices)
3. **Minor** - Nice to have (style, small refactors)

Include file:line references and suggested fixes.
