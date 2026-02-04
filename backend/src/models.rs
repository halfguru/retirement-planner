use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HouseholdConfig {
    pub retirement_age: u32,
    pub expected_annual_income: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccountBalance {
    pub rrsp: f64,
    pub tfsa: f64,
    pub resp: f64,
    pub non_registered: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContributionConfig {
    pub rrsp_annual: f64,
    pub tfsa_annual: f64,
    pub resp_annual: f64,
    pub non_registered_annual: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChildInfo {
    pub age: u32,
    pub target_contribution: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Assumptions {
    pub return_rate: f64,
    pub inflation_rate: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RetirementProjection {
    pub current_age: u32,
    pub retirement_age: u32,
    pub years_to_retirement: u32,
    pub net_worth_at_retirement: f64,
    pub annual_withdrawal: f64,
    pub pension_equivalent: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct YearlyProjection {
    pub year: u32,
    pub age: u32,
    pub rrsp: f64,
    pub tfsa: f64,
    pub resp: f64,
    pub non_registered: f64,
    pub total_net_worth: f64,
}
