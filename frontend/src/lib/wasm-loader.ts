import init, { RetirementCalculator } from './retirement_core.js'
import type { RetirementCalculator as RetirementCalculatorType } from './retirement_core.d.ts'

let wasmInitialized = false
let calculator: RetirementCalculatorType | null = null

export async function initWasm() {
  if (wasmInitialized) {
    return calculator
  }

  await init('/wasm/retirement_core_bg.wasm')
  calculator = new RetirementCalculator()
  wasmInitialized = true

  return calculator
}

export function getCalculator(): RetirementCalculatorType {
  if (!wasmInitialized || !calculator) {
    throw new Error('WASM not initialized. Call initWasm() first.')
  }
  return calculator
}
