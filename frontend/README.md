# Retirement Planner

A comprehensive retirement planning calculator for Canadian investors with RRSP and TFSA accounts.

## Features

- **Multi-Account Support**: Dynamic RRSP and TFSA account management
- **Growth Projection**: Visualize portfolio growth from current age to retirement age
- **Expected Return Configuration**: Adjustable annual return rate for projections
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes
- **Real-Time Calculations**: Instant portfolio updates as you modify inputs
- **WASM-Powered**: High-performance calculations using Rust WebAssembly

## Tech Stack

- **Frontend**: React 19 with TypeScript + Vite
- **Styling**: Tailwind CSS v4 with Inter font
- **Charts**: Recharts for responsive data visualization
- **Backend**: Rust compiled to WebAssembly for performance

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
cd retirement-planner/frontend
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build
```

### Type Checking

```bash
# Run TypeScript type checker
npm run typecheck
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Project Structure

```
frontend/
├── src/
│   ├── components/        # React components
│   ├── charts/          # Recharts visualization components
│   ├── lib/             # Utilities and WASM wrappers
│   └── types/           # TypeScript type definitions
├── public/
│   └── wasm/            # Compiled WASM binaries
├── package.json
└── vite.config.ts

backend/
├── src/
│   ├── calculations.rs   # Financial math logic
│   ├── models.rs        # Data structures
│   └── lib.rs           # WASM exports
└── Cargo.toml
```

## Usage

1. **Add Accounts**: Click "+ Add Account" to add RRSP or TFSA accounts
2. **Set Parameters**:
   - Current age and retirement age
   - Expected annual return rate (%)
3. **Manage Balances**: Update account balances as needed
4. **View Projections**: See current portfolio and projected growth to retirement

## Future Enhancements

- [ ] Annual contribution inputs
- [ ] Multiple account types (RESP, non-registered, RRIF, LIRA, FHSA)
- [ ] Tax-optimized withdrawal simulations
- [ ] Inflation rate configuration
- [ ] Multi-person household support
- [ ] Children education planning (RESP)
- [ ] Safe withdrawal rate calculations (4% rule)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
