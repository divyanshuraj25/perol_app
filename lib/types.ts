export type SalaryMode = "monthlyGross" | "annualCTC";

export type HRABasis = "metro50" | "nonMetro40" | "gross20";

export interface PayslipFormState {
  // Letterhead
  companyName: string;
  companyAddress: string;

  // Employee details
  employeeName: string;
  employeeId: string;
  designation: string;
  department: string;
  dateOfJoining: string; // ISO date (yyyy-mm-dd)
  payslipMonth: string; // yyyy-mm

  // Bank / statutory details
  bankName: string;
  accountNumber: string;
  uan: string;
  pan: string;

  // Salary input
  mode: SalaryMode;
  monthlyGross: number;
  annualCTC: number;
  hraBasis: HRABasis;

  // Custom breakdown override
  useCustomBreakdown: boolean;
  customBasic: number;
  customHRA: number;
  customSpecialAllowance: number;

  // Deduction overrides
  pfRatePercent: number;
  pfCapAt15000: boolean;
  professionalTax: number;
  tds: number;
}

export interface SalaryBreakdown {
  grossMonthly: number;
  basic: number;
  hra: number;
  specialAllowance: number;
  totalEarnings: number;
}

export interface DeductionBreakdown {
  pf: number;
  professionalTax: number;
  tds: number;
  totalDeductions: number;
}
