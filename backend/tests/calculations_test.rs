use retirement_core::calculations::calculate_additional_annual_savings;

#[test]
fn test_additional_annual_savings_no_gap() {
    let current: f64 = 1000000.0;
    let target: f64 = 900000.0;
    let years = 27;
    let result = calculate_additional_annual_savings(current, target, years, 7.0, 2.5, 0.0);
    assert_eq!(result, 0.0);
}

#[test]
fn test_additional_annual_savings_zero_years() {
    let current: f64 = 100000.0;
    let target: f64 = 1000000.0;
    let years = 0;
    let result = calculate_additional_annual_savings(current, target, years, 7.0, 2.5, 0.0);
    assert_eq!(result, 0.0);
}

#[test]
fn test_additional_annual_savings_simple_case() {
    let current: f64 = 10000.0;
    let target: f64 = 2362500.0;
    let years = 27;
    let return_rate: f64 = 7.0;
    let inflation: f64 = 2.5;
    let current_contributions: f64 = 0.0;

    let additional = calculate_additional_annual_savings(
        current,
        target,
        years,
        return_rate,
        inflation,
        current_contributions,
    );

    // Verify that adding this amount brings us close to the target
    let monthly_rate = return_rate / 100.0 / 12.0;
    let monthly_inflation = inflation / 100.0 / 12.0;
    let months = years * 12;
    let inflation_factor = (1.0_f64 + monthly_inflation).powi(months as i32);
    let monthly_contribution = (current_contributions + additional) / 12.0;

    let mut balance = current;
    for _ in 0..months {
        balance = balance * (1.0 + monthly_rate) + monthly_contribution;
    }

    let final_value = balance / inflation_factor;

    // Should be within $100 of target (tolerance in binary search)
    let diff = final_value - target;
    assert!(
        diff.abs() < 100.0,
        "Final value {} is more than $100 from target {}",
        final_value,
        target
    );
}

#[test]
fn test_additional_annual_savings_with_existing_contributions() {
    let current: f64 = 10000.0;
    let target: f64 = 2362500.0;
    let years = 27;
    let return_rate: f64 = 7.0;
    let inflation: f64 = 2.5;
    let current_contributions: f64 = 10000.0;

    let additional = calculate_additional_annual_savings(
        current,
        target,
        years,
        return_rate,
        inflation,
        current_contributions,
    );

    // Additional should be less than when starting from 0
    let additional_zero =
        calculate_additional_annual_savings(current, target, years, return_rate, inflation, 0.0);

    assert!(
        additional < additional_zero,
        "Additional savings with existing contributions {} should be less than without {}",
        additional,
        additional_zero
    );
}

#[test]
fn test_additional_annual_savings_exact_match() {
    let current: f64 = 10000.0;
    let target: f64 = 2362500.0;
    let years = 27;
    let return_rate: f64 = 7.0;
    let inflation: f64 = 2.5;

    // Calculate the exact additional needed
    let additional =
        calculate_additional_annual_savings(current, target, years, return_rate, inflation, 0.0);

    // Now simulate with that exact amount
    let monthly_rate = return_rate / 100.0 / 12.0;
    let monthly_inflation = inflation / 100.0 / 12.0;
    let months = years * 12;
    let inflation_factor = (1.0_f64 + monthly_inflation).powi(months as i32);
    let monthly_contribution = additional / 12.0;

    let mut balance = current;
    for _ in 0..months {
        balance = balance * (1.0 + monthly_rate) + monthly_contribution;
    }

    let final_value = balance / inflation_factor;

    // The gap should be less than tolerance ($100)
    let gap = final_value - target;
    assert!(
        gap.abs() < 100.0,
        "Gap {} is greater than tolerance $100",
        gap
    );
}

#[test]
fn test_additional_annual_savings_user_scenario() {
    let current: f64 = 10000.0;
    let target: f64 = 2362500.0;
    let years = 27;
    let return_rate: f64 = 7.0;
    let inflation: f64 = 2.5;
    let current_contributions: f64 = 10000.0;

    // Calculate additional needed
    let additional = calculate_additional_annual_savings(
        current,
        target,
        years,
        return_rate,
        inflation,
        current_contributions,
    );

    // User adds this amount (57,308)
    let total_annual = current_contributions + additional;

    // Simulate to verify
    let monthly_rate = return_rate / 100.0 / 12.0;
    let monthly_inflation = inflation / 100.0 / 12.0;
    let months = years * 12;
    let inflation_factor = (1.0_f64 + monthly_inflation).powi(months as i32);
    let monthly_contribution = total_annual / 12.0;

    let mut balance = current;
    for _ in 0..months {
        balance = balance * (1.0 + monthly_rate) + monthly_contribution;
    }

    let final_value = balance / inflation_factor;

    // Should be within $100 of target (very small gap expected)
    let gap = final_value - target;
    assert!(
        gap.abs() < 100.0,
        "Gap {} is greater than tolerance $100. Additional: {}, Total: {}",
        gap,
        additional,
        total_annual
    );
}
