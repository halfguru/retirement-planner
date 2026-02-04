use crate::models::{
    AccountBalance, Assumptions, ChildInfo, ContributionConfig, HouseholdConfig,
    RetirementProjection, YearlyProjection,
};

pub fn calculate_projection(
    household_config: &HouseholdConfig,
    account_balance: &AccountBalance,
    contributions: &ContributionConfig,
    _children: &[ChildInfo],
    assumptions: &Assumptions,
    current_age: u32,
) -> RetirementProjection {
    let years_to_retirement = household_config.retirement_age.saturating_sub(current_age);

    if years_to_retirement == 0 {
        return RetirementProjection {
            current_age,
            retirement_age: household_config.retirement_age,
            years_to_retirement: 0,
            net_worth_at_retirement: account_balance.rrsp
                + account_balance.tfsa
                + account_balance.non_registered,
            annual_withdrawal: 0.0,
            pension_equivalent: 0.0,
        };
    }

    let monthly_return_rate = assumptions.return_rate / 100.0 / 12.0;
    let months_to_retirement = years_to_retirement * 12;

    let monthly_contributions = (contributions.rrsp_annual
        + contributions.tfsa_annual
        + contributions.non_registered_annual)
        / 12.0;

    let initial_balance =
        account_balance.rrsp + account_balance.tfsa + account_balance.non_registered;

    let net_worth_at_retirement = calculate_future_value(
        initial_balance,
        monthly_contributions,
        monthly_return_rate,
        months_to_retirement,
    );

    let annual_withdrawal = calculate_safe_withdrawal(net_worth_at_retirement);
    let pension_equivalent = annual_withdrawal;

    RetirementProjection {
        current_age,
        retirement_age: household_config.retirement_age,
        years_to_retirement,
        net_worth_at_retirement,
        annual_withdrawal,
        pension_equivalent,
    }
}

pub fn calculate_yearly_projections(
    household_config: &HouseholdConfig,
    account_balance: &AccountBalance,
    contributions: &ContributionConfig,
    assumptions: &Assumptions,
    current_age: u32,
) -> Vec<YearlyProjection> {
    let years_to_retirement = household_config.retirement_age.saturating_sub(current_age);
    let monthly_return_rate = assumptions.return_rate / 100.0 / 12.0;

    let mut rrsp = account_balance.rrsp;
    let mut tfsa = account_balance.tfsa;
    let mut resp = account_balance.resp;
    let mut non_registered = account_balance.non_registered;

    let mut projections = Vec::new();

    let current_year = 2025;

    for year in 0..=years_to_retirement {
        projections.push(YearlyProjection {
            year: current_year + year,
            age: current_age + year,
            rrsp,
            tfsa,
            resp,
            non_registered,
            total_net_worth: rrsp + tfsa + resp + non_registered,
        });

        if year < years_to_retirement {
            for _ in 0..12 {
                rrsp = rrsp * (1.0 + monthly_return_rate) + (contributions.rrsp_annual / 12.0);
                tfsa = tfsa * (1.0 + monthly_return_rate) + (contributions.tfsa_annual / 12.0);
                resp = resp * (1.0 + monthly_return_rate) + (contributions.resp_annual / 12.0);
                non_registered = non_registered * (1.0 + monthly_return_rate)
                    + (contributions.non_registered_annual / 12.0);
            }
        }
    }

    projections
}

fn calculate_future_value(
    present_value: f64,
    monthly_contribution: f64,
    monthly_return_rate: f64,
    months: u32,
) -> f64 {
    let fv_of_pv = present_value * (1.0 + monthly_return_rate).powi(months as i32);
    let fv_of_contributions = monthly_contribution
        * ((1.0 + monthly_return_rate).powi(months as i32) - 1.0)
        / monthly_return_rate;
    fv_of_pv + fv_of_contributions
}

fn calculate_safe_withdrawal(net_worth: f64) -> f64 {
    net_worth * 0.04
}
