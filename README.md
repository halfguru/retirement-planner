# 🍁 Retire, Eh?

[![CI](https://github.com/halfguru/retire-eh/actions/workflows/ci.yml/badge.svg)](https://github.com/halfguru/retire-eh/actions/workflows/ci.yml)
[![Deploy](https://github.com/halfguru/retire-eh/actions/workflows/deploy.yml/badge.svg)](https://github.com/halfguru/retire-eh/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Plan your Canadian retirement, eh?

A household-first retirement planner for Canadians. Plan your RRSP, TFSA, and CPP strategy with conservative projections and transparent calculations. All calculations happen in your browser — no accounts, no data collection, complete privacy.

**[🔗 Live Demo](https://halfguru.github.io/retire-eh/)**

## ✨ Features

- **🏠 Household-first dashboard** — Combined progress, not siloed by individual
- **🇨🇦 Canadian-focused** — Built for RRSP, TFSA, and CPP planning
- **📊 Clear projections** — Visualize your portfolio growth over time
- **🎯 Goal tracking** — See if you're on track for your retirement income target
- **🔒 Privacy-first** — All calculations run locally in your browser
- **⚡ Fast** — Core calculations powered by Rust/WebAssembly

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/halfguru/retire-eh.git
cd retire-eh

# Install frontend dependencies
cd frontend && npm install

# Start development server
npm run dev
```

Open http://localhost:5173 to view the app.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React + TypeScript + Tailwind CSS |
| **Charts** | Recharts |
| **Calculations** | Rust compiled to WebAssembly (WASM) |

The Rust core provides:
- Single source of truth for all financial calculations
- Deterministic, testable logic
- High performance in the browser

## 📖 Development

### Build Commands

**Frontend:**
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run typecheck  # TypeScript check
npm run lint       # ESLint
```

**Backend (Rust/WASM):**
```bash
cd backend
cargo build        # Build Rust
cargo test         # Run tests
cargo clippy       # Lint
wasm-pack build --target web  # Build WASM
```

### AI-Assisted Development

This project includes [OpenCode](https://opencode.ai) configuration:

| Command | Description |
|---------|-------------|
| `/feature <name>` | Full feature workflow |
| `/review` | Multi-specialist code review |
| `/prepare-pr` | PR with WASM validation |

See [AGENTS.md](./AGENTS.md) for detailed build commands and conventions.

## 🎯 Design Philosophy

### Core Principles

- **Conservative assumptions** — Realistic, not optimistic projections
- **Explicit explanations** — Show the math, don't hide it
- **Household-first approach** — Evaluate savings jointly

### Canadian Retirement Philosophy

> One household balance sheet, multiple tax wrappers.

- Retirement success is a **household outcome**
- Savings evaluated jointly, regardless of who contributes
- Strategic allocation between RRSP and TFSA based on marginal tax rates

## 🚫 Non-Goals (For Now)

- Bank account linking
- Real-time market data
- Complex tax optimization engines
- Monte Carlo simulations
- FIRE or early-retirement evangelism
- Non-Canadian retirement accounts (401k, IRA, etc.)

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

*Built with ❤️ in Canada using Rust (WASM), React, and TypeScript*
