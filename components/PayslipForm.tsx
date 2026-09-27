"use client";

import type { ChangeEvent, ReactNode } from "react";
import {
  Banknote,
  Building2,
  Landmark,
  Receipt,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatNumberIN } from "@/lib/format";
import type { HRABasis, PayslipFormState, SalaryMode } from "@/lib/types";

interface PayslipFormProps {
  value: PayslipFormState;
  onChange: (patch: Partial<PayslipFormState>) => void;
}

const PRESET_AMOUNTS = [25000, 50000, 100000];

const inputClass =
  "w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-navy-light focus:outline-none focus:ring-2 focus:ring-navy-light/15";

export default function PayslipForm({ value, onChange }: PayslipFormProps) {
  const text =
    (key: keyof PayslipFormState) => (event: ChangeEvent<HTMLInputElement>) =>
      onChange({ [key]: event.target.value } as Partial<PayslipFormState>);

  const number =
    (key: keyof PayslipFormState) => (event: ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;
      onChange({ [key]: raw === "" ? 0 : Number(raw) } as Partial<PayslipFormState>);
    };

  return (
    <div className="space-y-8">
      <section>
        <SectionHeader
          icon={Building2}
          title="Company letterhead"
          description="Shown at the top of the payslip"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Company name">
            <input
              className={inputClass}
              value={value.companyName}
              onChange={text("companyName")}
              placeholder="Acme Technologies Pvt. Ltd."
            />
          </Field>
          <Field label="Registered address">
            <input
              className={inputClass}
              value={value.companyAddress}
              onChange={text("companyAddress")}
              placeholder="4th Floor, Cyber Towers, Hyderabad, IN"
            />
          </Field>
        </div>
      </section>

      <section>
        <SectionHeader
          icon={UserRound}
          title="Employee details"
          description="Who this payslip belongs to"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Employee name">
            <input
              className={inputClass}
              value={value.employeeName}
              onChange={text("employeeName")}
              placeholder="Aarav Sharma"
            />
          </Field>
          <Field label="Employee ID">
            <input
              className={inputClass}
              value={value.employeeId}
              onChange={text("employeeId")}
              placeholder="EMP-1042"
            />
          </Field>
          <Field label="Designation">
            <input
              className={inputClass}
              value={value.designation}
              onChange={text("designation")}
              placeholder="Senior Software Engineer"
            />
          </Field>
          <Field label="Department">
            <input
              className={inputClass}
              value={value.department}
              onChange={text("department")}
              placeholder="Engineering"
            />
          </Field>
          <Field label="Date of joining">
            <input
              type="date"
              className={inputClass}
              value={value.dateOfJoining}
              onChange={text("dateOfJoining")}
            />
          </Field>
          <Field label="Payslip month">
            <input
              type="month"
              className={inputClass}
              value={value.payslipMonth}
              onChange={text("payslipMonth")}
            />
          </Field>
        </div>
      </section>

      <section>
        <SectionHeader
          icon={Landmark}
          title="Bank & statutory details"
          description="For salary credit and compliance records"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Bank name">
            <input
              className={inputClass}
              value={value.bankName}
              onChange={text("bankName")}
              placeholder="HDFC Bank"
            />
          </Field>
          <Field label="Account number">
            <input
              className={inputClass}
              value={value.accountNumber}
              onChange={text("accountNumber")}
              placeholder="50100XXXXXXXX"
            />
          </Field>
          <Field label="UAN">
            <input
              className={inputClass}
              value={value.uan}
              onChange={text("uan")}
              placeholder="101234567890"
            />
          </Field>
          <Field label="PAN">
            <input
              className={inputClass}
              value={value.pan}
              onChange={text("pan")}
              placeholder="ABCDE1234F"
            />
          </Field>
        </div>
      </section>

      <section>
        <SectionHeader
          icon={Banknote}
          title="Salary structure"
          description="Drives the earnings breakdown"
        />

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <ModeToggle
              mode={value.mode}
              disabled={value.useCustomBreakdown}
              onSelect={(mode) => onChange({ mode })}
            />
          </div>

          {!value.useCustomBreakdown && (
            <>
              <Field
                label={value.mode === "annualCTC" ? "Annual CTC" : "Gross monthly salary"}
                hint={
                  value.mode === "annualCTC"
                    ? "Simplified model: monthly gross = CTC ÷ 12."
                    : undefined
                }
              >
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    className={`${inputClass} pl-7`}
                    value={
                      value.mode === "annualCTC"
                        ? value.annualCTC || ""
                        : value.monthlyGross || ""
                    }
                    onChange={number(value.mode === "annualCTC" ? "annualCTC" : "monthlyGross")}
                    placeholder="0"
                  />
                </div>
              </Field>

              {value.mode === "monthlyGross" && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted">Quick presets:</span>
                  {PRESET_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => onChange({ mode: "monthlyGross", monthlyGross: amount })}
                      className="rounded-full border border-line px-3 py-1 text-xs text-ink/70 transition-colors hover:border-navy-light hover:text-navy"
                    >
                      ₹{formatNumberIN(amount)}
                    </button>
                  ))}
                </div>
              )}

              <Field label="HRA basis">
                <select
                  className={inputClass}
                  value={value.hraBasis}
                  onChange={(event) =>
                    onChange({ hraBasis: event.target.value as HRABasis })
                  }
                >
                  <option value="metro50">Metro city — 50% of Basic</option>
                  <option value="nonMetro40">Non-metro city — 40% of Basic</option>
                  <option value="gross20">Flat — 20% of Gross</option>
                </select>
              </Field>
            </>
          )}

          <div className="flex items-start justify-between gap-4 rounded-md border border-line bg-canvas/60 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink">Custom breakdown</p>
              <p className="text-xs text-muted">
                Override auto-calculation and set Basic, HRA and Special Allowance directly.
              </p>
            </div>
            <ToggleSwitch
              checked={value.useCustomBreakdown}
              onChange={(checked) => onChange({ useCustomBreakdown: checked })}
              label="Toggle custom salary breakdown"
            />
          </div>

          {value.useCustomBreakdown && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Basic salary">
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={value.customBasic || ""}
                  onChange={number("customBasic")}
                  placeholder="0"
                />
              </Field>
              <Field label="HRA">
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={value.customHRA || ""}
                  onChange={number("customHRA")}
                  placeholder="0"
                />
              </Field>
              <Field label="Special allowance">
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={value.customSpecialAllowance || ""}
                  onChange={number("customSpecialAllowance")}
                  placeholder="0"
                />
              </Field>
            </div>
          )}
        </div>
      </section>

      <section>
        <SectionHeader
          icon={Receipt}
          title="Deductions"
          description="Provident fund, professional tax and TDS"
        />
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="PF rate (%)" hint="Standard statutory rate is 12%.">
              <input
                type="number"
                min={0}
                max={100}
                step={0.5}
                className={inputClass}
                value={value.pfRatePercent}
                onChange={number("pfRatePercent")}
              />
            </Field>
            <Field label="Professional tax" hint="Flat slab, varies by state.">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">
                  ₹
                </span>
                <input
                  type="number"
                  min={0}
                  className={`${inputClass} pl-7`}
                  value={value.professionalTax}
                  onChange={number("professionalTax")}
                />
              </div>
            </Field>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-md border border-line bg-canvas/60 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink">Cap PF wage at ₹15,000</p>
              <p className="text-xs text-muted">
                Applies the statutory PF wage ceiling before computing 12%.
              </p>
            </div>
            <ToggleSwitch
              checked={value.pfCapAt15000}
              onChange={(checked) => onChange({ pfCapAt15000: checked })}
              label="Toggle PF wage ceiling"
            />
          </div>

          <Field label="TDS / income tax" hint="Estimated monthly tax deducted at source.">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">
                ₹
              </span>
              <input
                type="number"
                min={0}
                className={`${inputClass} pl-7`}
                value={value.tds}
                onChange={number("tds")}
              />
            </div>
          </Field>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5 border-b border-line pb-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-navy/[0.06] text-navy">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <div>
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {description && <p className="text-xs text-muted">{description}</p>}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-ink/80">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

function ModeToggle({
  mode,
  disabled,
  onSelect,
}: {
  mode: SalaryMode;
  disabled?: boolean;
  onSelect: (mode: SalaryMode) => void;
}) {
  const options: { key: SalaryMode; label: string }[] = [
    { key: "monthlyGross", label: "Monthly gross" },
    { key: "annualCTC", label: "Annual CTC" },
  ];

  return (
    <div
      className={`inline-flex rounded-md border border-line bg-canvas p-0.5 ${
        disabled ? "pointer-events-none opacity-50" : ""
      }`}
    >
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onSelect(option.key)}
          className={`rounded-[5px] px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === option.key
              ? "bg-navy text-paper shadow-sm"
              : "text-ink/70 hover:text-navy"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-navy" : "bg-line"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-paper shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
