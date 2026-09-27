"use client";

import { useMemo, useState } from "react";
import { Download, FileSpreadsheet, Printer, RotateCcw } from "lucide-react";
import PayslipForm from "@/components/PayslipForm";
import PayslipPreview from "@/components/PayslipPreview";
import { computeDeductions, computeNetPay, computeSalaryBreakdown } from "@/lib/calculations";
import type { PayslipFormState } from "@/lib/types";

function getDefaultMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

const DEFAULT_FORM_STATE: PayslipFormState = {
  companyName: "Acme Technologies Pvt. Ltd.",
  companyAddress: "4th Floor, Cyber Towers, Hitech City, Hyderabad, Telangana",

  employeeName: "Aarav Sharma",
  employeeId: "EMP-1042",
  designation: "Senior Software Engineer",
  department: "Engineering",
  dateOfJoining: "2022-03-14",
  payslipMonth: getDefaultMonth(),

  bankName: "HDFC Bank",
  accountNumber: "50100123456789",
  uan: "101234567890",
  pan: "ABCDE1234F",

  mode: "monthlyGross",
  monthlyGross: 75000,
  annualCTC: 900000,
  hraBasis: "metro50",

  useCustomBreakdown: false,
  customBasic: 0,
  customHRA: 0,
  customSpecialAllowance: 0,

  pfRatePercent: 12,
  pfCapAt15000: false,
  professionalTax: 200,
  tds: 0,
};

type MobileView = "form" | "preview";

export default function HomePage() {
  const [form, setForm] = useState<PayslipFormState>(DEFAULT_FORM_STATE);
  const [mobileView, setMobileView] = useState<MobileView>("form");

  const updateForm = (patch: Partial<PayslipFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const breakdown = useMemo(() => computeSalaryBreakdown(form), [form]);

  const deductions = useMemo(
    () =>
      computeDeductions({
        basic: breakdown.basic,
        pfRatePercent: form.pfRatePercent,
        pfCapAt15000: form.pfCapAt15000,
        professionalTax: form.professionalTax,
        tds: form.tds,
      }),
    [breakdown.basic, form.pfRatePercent, form.pfCapAt15000, form.professionalTax, form.tds]
  );

  const netPay = useMemo(
    () => computeNetPay(breakdown.totalEarnings, deductions.totalDeductions),
    [breakdown.totalEarnings, deductions.totalDeductions]
  );

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleReset = () => {
    setForm(DEFAULT_FORM_STATE);
  };

  return (
    <main className="min-h-screen bg-canvas">
      <header className="no-print sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-navy text-paper">
              <FileSpreadsheet className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight text-ink">Payroll Studio</p>
              <p className="text-xs leading-tight text-muted">Salary slip generator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="hidden items-center gap-1.5 rounded-md border border-line px-3 py-2 text-xs font-medium text-ink/70 transition-colors hover:border-navy-light hover:text-navy sm:flex"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
              Reset
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-xs font-medium text-ink/70 transition-colors hover:border-navy-light hover:text-navy"
            >
              <Printer className="h-3.5 w-3.5" strokeWidth={1.75} />
              Print
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-md bg-navy px-3 py-2 text-xs font-medium text-paper shadow-sm transition-colors hover:bg-navy-light"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
              Download PDF
            </button>
          </div>
        </div>
      </header>

      <div className="no-print mx-auto max-w-7xl px-4 pt-4 sm:hidden">
        <div className="inline-flex w-full rounded-md border border-line bg-paper p-0.5">
          {(["form", "preview"] as MobileView[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setMobileView(tab)}
              className={`flex-1 rounded-[5px] px-3 py-2 text-xs font-medium capitalize transition-colors ${
                mobileView === tab ? "bg-navy text-paper" : "text-ink/70"
              }`}
            >
              {tab === "form" ? "Edit details" : "Preview slip"}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-8 lg:px-8 lg:py-8">
        <section
          className={`no-print slim-scroll rounded-lg border border-line bg-paper p-5 sm:p-6 lg:sticky lg:top-[89px] lg:h-[calc(100vh-113px)] lg:overflow-y-auto ${
            mobileView === "form" ? "block" : "hidden lg:block"
          }`}
        >
          <PayslipForm value={form} onChange={updateForm} />
        </section>

        <section
          className={`print:!block ${mobileView === "preview" ? "block" : "hidden lg:block"}`}
        >
          <PayslipPreview
            form={form}
            breakdown={breakdown}
            deductions={deductions}
            netPay={netPay}
          />
        </section>
      </div>
    </main>
  );
}
