import init, { RetirementCalculator } from './financial_math_wasm.js'

let wasmInitialized = false
let calculator: RetirementCalculator | null = null

export async function initWasm() {
  if (wasmInitialized) {
    return calculator
  }

  await init('/wasm/retirement_core_bg.wasm')
  calculator = new RetirementCalculator()
  wasmInitialized = true

  return calculator
}

export function getCalculator() {
  if (!wasmInitialized || !calculator) {
    throw new Error('WASM not initialized. Call initWasm() first.')
  }
  return calculator
}
