# Retirement Planning App

A household-first retirement planning tool with conservative projections and transparent calculations.

---

## Purpose

Build a retirement planning app that answers:

> "Are we actually on track — and why?"

This tool provides clear, deterministic calculations to help households understand their retirement trajectory.

---

## Design Philosophy

### Core Principles

* **Conservative assumptions** - Default to realistic, not optimistic projections
* **Explicit explanations** - Show the math, don't hide it
* **Household-first approach** - Evaluate savings jointly, not by individual accounts

### Approach

* Clear models with deterministic calculations
* Conservative, defensible assumptions
* Household-level framing (shared outcomes)

---

## Retirement Planning Philosophy

* Retirement success is a **household outcome**
* Savings are evaluated jointly, regardless of who contributes
* Tax-advantaged account allocation should be **strategic**, not equal
* Higher marginal tax rate → tax-deferred accounts priority
* Lower marginal tax rate → tax-free accounts priority

Core reframing:

> One household balance sheet, multiple tax wrappers.

---

## Key Differentiators

* **Household-first dashboard** - Combined household progress, not siloed by individual
* **Pension-equivalent framing** - "Your plan ≈ $X/year indexed pension"
* **Strategic allocation guidance** - Data-driven recommendations on tax-advantaged accounts
* **Scenario testing** - Test different assumptions and see their impact

---

## Tech Stack

### High-Level Architecture

* Web-first application
* No backend initially (client-side only)
* No user accounts
* Privacy-first (all calculations happen in the browser)

### Implementation

* **Frontend:** React + TypeScript + Tailwind CSS
* **UI Components:** shadcn/ui or similar for polished, modern interface
* **Charts:** Recharts for clean visualizations
* **Core financial logic:** Rust compiled to WebAssembly (WASM)
* **Optional future:** Desktop app via Tauri (same Rust core)

The Rust core exists to:
* Be the single source of truth for calculations
* Reduce bugs and ambiguity
* Increase trust in outputs

### Development Workflow

This project includes an [OpenCode](https://opencode.ai) configuration for structured AI-assisted development:

* `/feature <name>` - Full feature workflow
* `/review` - Multi-specialist code review
* `/prepare-pr` - PR preparation with WASM validation

See [AGENTS.md](./AGENTS.md) for build commands and conventions.

---

## What the App Must Do Well

* Show household progress clearly
* Translate savings into *income*, not just balances
* Make pension comparisons fair and explicit
* Provide transparent, understandable calculations
* Deliver a polished, professional user experience

---

## Non-Goals (For Now)

* Bank account linking
* Real-time market data
* Complex tax optimization engines
* Monte Carlo simulations
* FIRE or early-retirement evangelism

Those may come later, but clarity comes first.

---

## Success Criteria

This project is successful if:
* Users can make informed financial decisions
* The logic is understandable and explainable
* Conservative assumptions build trust
* The tool provides actionable insights
* The UI is polished and intuitive

---

*End of context. This file should be treated as long-term background for all discussions related to this project.*
