---
name: wasm-workflow
description: WASM build and integration workflow for Rust projects
license: MIT
compatibility: opencode
---

## WASM Development Workflow

General guidance for Rust projects compiled to WebAssembly using wasm-pack.

### Build Command

```bash
cd <rust-crate> && wasm-pack build --target web
```

### Output Artifacts

After building, `pkg/` directory contains:
- `*_bg.wasm` - WebAssembly binary
- `*.js` - JavaScript glue code
- `*_bg.wasm.d.ts` - TypeScript type definitions

### Integration Checklist

When integrating WASM into a frontend:

1. Build the WASM package
2. Copy `.wasm` binary to public/static assets
3. Copy `.js` glue code to source directory
4. Copy `.d.ts` types for TypeScript support

### Rust Best Practices for WASM

- Use `wasm-bindgen` for JS interop
- Avoid panics - use `Result` types
- Minimize allocations across the boundary
- Use `#[wasm_bindgen]` on public functions only

### Validation

Before committing WASM changes:
- [ ] `cargo test` passes
- [ ] `cargo clippy` has no warnings
- [ ] `cargo fmt --check` passes
- [ ] WASM builds without errors
- [ ] Frontend types compile correctly

### TypeScript Usage

```typescript
import init, { exportedFunction } from './path/to/wasm-module'

// Initialize once at app startup
await init()

// Call exported functions
const result = exportedFunction(params)
```
