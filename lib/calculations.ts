import type {
  DeductionBreakdown,
  PayslipFormState,
  SalaryBreakdown,
} from "./types";

const PF_WAGE_CEILING = 15000;

/**
 * Derives the earnings breakdown (Basic / HRA / Special Allowance) from
 * either a monthly gross salary or an annual CTC figure, following the
 * standard Indian payroll convention:
 *   Basic = 50% of Gross
 *   HRA   = 50% of Basic (metro) | 40% of Basic (non-metro) | 20% of Gross
 *   Special Allowance = remaining balance of Gross
 *
 * When `useCustomBreakdown` is enabled, the user-supplied Basic / HRA /
 * Special Allowance values are used verbatim and the gross is derived as
 * their sum.
 */
export function computeSalaryBreakdown(
  form: Pick<
    PayslipFormState,
    | "mode"
    | "monthlyGross"
    | "annualCTC"
    | "hraBasis"
    | "useCustomBreakdown"
    | "customBasic"
    | "customHRA"
    | "customSpecialAllowance"
  >
): SalaryBreakdown {
  if (form.useCustomBreakdown) {
    const basic = safeNonNegative(form.customBasic);
    const hra = safeNonNegative(form.customHRA);
    const specialAllowance = safeNonNegative(form.customSpecialAllowance);
    const totalEarnings = basic + hra + specialAllowance;
    return {
      grossMonthly: totalEarnings,
      basic,
      hra,
      specialAllowance,
      totalEarnings,
    };
  }

  const grossMonthly =
    form.mode === "annualCTC"
      ? safeNonNegative(form.annualCTC) / 12
      : safeNonNegative(form.monthlyGross);

  const basic = Math.round(grossMonthly * 0.5);

  let hra: number;
  if (form.hraBasis === "metro50") {
    hra = Math.round(basic * 0.5);
  } else if (form.hraBasis === "nonMetro40") {
    hra = Math.round(basic * 0.4);
  } else {
    hra = Math.round(grossMonthly * 0.2);
  }

  const specialAllowance = Math.max(0, Math.round(grossMonthly - basic - hra));
  const totalEarnings = basic + hra + specialAllowance;

  return {
    grossMonthly: Math.round(grossMonthly),
    basic,
    hra,
    specialAllowance,
    totalEarnings,
  };
}

/**
 * Computes statutory-style deductions:
 *   PF  = configurable % (default 12%) of Basic, optionally capped at the
 *         PF wage ceiling of ₹15,000
 *   PT  = flat, editable (defaults to the common ₹200 slab)
 *   TDS = user-supplied estimate (defaults to ₹0)
 */
export function computeDeductions(
  params: Pick<
    PayslipFormState,
    "pfRatePercent" | "pfCapAt15000" | "professionalTax" | "tds"
  > & { basic: number }
): DeductionBreakdown {
  const pfWage = params.pfCapAt15000
    ? Math.min(params.basic, PF_WAGE_CEILING)
    : params.basic;

  const pf = Math.round(pfWage * (safeNonNegative(params.pfRatePercent) / 100));
  const professionalTax = safeNonNegative(params.professionalTax);
  const tds = safeNonNegative(params.tds);
  const totalDeductions = pf + professionalTax + tds;

  return { pf, professionalTax, tds, totalDeductions };
}

export function computeNetPay(totalEarnings: number, totalDeductions: number): number {
  return totalEarnings - totalDeductions;
}

function safeNonNegative(value: number): number {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, value);
}
