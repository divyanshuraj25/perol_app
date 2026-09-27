import { formatDate, formatINR, formatMonthYear, initialsFromName } from "@/lib/format";
import { amountInWords } from "@/lib/numberToWords";
import type { DeductionBreakdown, PayslipFormState, SalaryBreakdown } from "@/lib/types";

interface PayslipPreviewProps {
  form: PayslipFormState;
  breakdown: SalaryBreakdown;
  deductions: DeductionBreakdown;
  netPay: number;
}

export default function PayslipPreview({
  form,
  breakdown,
  deductions,
  netPay,
}: PayslipPreviewProps) {
  const generatedOn = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      id="payslip-print-area"
      className="mx-auto w-full max-w-document rounded-sm border border-line bg-paper shadow-document"
    >
      {/* Letterhead */}
      <div className="flex items-start justify-between gap-4 border-b-2 border-navy px-6 py-6 sm:px-8">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-navy font-serif text-base font-semibold text-paper">
            {initialsFromName(form.companyName || "Company")}
          </div>
          <div>
            <p className="font-serif text-lg font-semibold leading-tight text-navy-dark sm:text-xl">
              {form.companyName || "Company Name"}
            </p>
            <p className="mt-0.5 max-w-[26rem] text-xs text-muted">
              {form.companyAddress || "Company address"}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="rounded-sm bg-navy/[0.06] px-2.5 py-1 text-[11px] font-semibold text-navy">
            Payslip
          </span>
          <p className="text-right text-xs text-muted">
            Pay period
            <span className="ml-1 font-medium text-ink">
              {formatMonthYear(form.payslipMonth)}
            </span>
          </p>
        </div>
      </div>

      {/* Employee + bank details */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-3 border-b border-line px-6 py-6 text-sm sm:grid-cols-2 sm:px-8">
        <DetailRow label="Employee name" value={form.employeeName || "—"} />
        <DetailRow label="Bank name" value={form.bankName || "—"} />
        <DetailRow label="Employee ID" value={form.employeeId || "—"} />
        <DetailRow label="Account number" value={form.accountNumber || "—"} />
        <DetailRow label="Designation" value={form.designation || "—"} />
        <DetailRow label="UAN" value={form.uan || "—"} />
        <DetailRow label="Department" value={form.department || "—"} />
        <DetailRow label="PAN" value={form.pan || "—"} />
        <DetailRow label="Date of joining" value={formatDate(form.dateOfJoining)} />
      </div>

      {/* Earnings & deductions */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 px-6 py-6 sm:grid-cols-2 sm:px-8">
        <div>
          <p className="mb-2 text-xs font-semibold text-navy">Earnings</p>
          <LedgerRow label="Basic salary" value={breakdown.basic} />
          <LedgerRow label="House rent allowance" value={breakdown.hra} />
          <LedgerRow label="Special allowance" value={breakdown.specialAllowance} />
          <LedgerRow label="Total earnings" value={breakdown.totalEarnings} isTotal />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold text-navy">Deductions</p>
          <LedgerRow label="Provident fund (PF)" value={deductions.pf} />
          <LedgerRow label="Professional tax" value={deductions.professionalTax} />
          <LedgerRow label="TDS / income tax" value={deductions.tds} />
          <LedgerRow label="Total deductions" value={deductions.totalDeductions} isTotal />
        </div>
      </div>

      {/* Net pay banner */}
      <div className="flex flex-col gap-3 border-y border-line bg-canvas/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-xs font-medium text-muted">Net take-home pay</p>
          <p className="mt-0.5 max-w-md text-xs italic text-muted">
            {amountInWords(netPay)}
          </p>
        </div>
        <p className="font-mono text-2xl font-semibold tabular-nums text-navy sm:text-3xl">
          {formatINR(netPay)}
        </p>
      </div>

      {/* Signature & footer */}
      <div className="flex flex-col gap-6 px-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div className="max-w-sm">
          <p className="text-xs leading-relaxed text-muted">
            This is a system-generated payslip and does not require a physical
            signature. Strictly confidential — intended solely for the named
            employee.
          </p>
          <p className="mt-2 text-[11px] text-muted/80">Generated on {generatedOn}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="h-10 w-28 border-b border-dashed border-line" />
            <p className="mt-1.5 text-[11px] text-muted">Authorized signatory</p>
          </div>
          <SealMark />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-right text-sm font-medium text-ink">{value}</span>
    </div>
  );
}

function LedgerRow({
  label,
  value,
  isTotal,
}: {
  label: string;
  value: number;
  isTotal?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between py-1.5 text-sm ${
        isTotal
          ? "mt-1 border-t-2 border-navy pt-2 font-semibold text-ink"
          : "border-b border-line/70 text-ink/80"
      }`}
    >
      <span>{label}</span>
      <span className="font-mono tabular-nums">{formatINR(value)}</span>
    </div>
  );
}

function SealMark() {
  return (
    <div
      aria-hidden
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gold/60 text-center"
    >
      <span className="font-serif text-[9px] font-semibold uppercase leading-tight tracking-wide text-gold">
        Official
        <br />
        seal
      </span>
    </div>
  );
}
