# Payroll Studio — Salary Slip Generator

A production-ready Payroll & Salary Slip Generator built with Next.js (App
Router), TypeScript and Tailwind CSS, following standard Indian payroll
conventions.

## Features

- Grouped, live-updating form: company letterhead, employee details,
  bank/statutory details, salary structure and deduction overrides.
- Auto-calculated earnings breakdown from either a **monthly gross salary**
  or an **annual CTC**:
  - Basic = 50% of Gross
  - HRA = 50% of Basic (metro) / 40% of Basic (non-metro) / 20% of Gross
  - Special Allowance = remaining balance of Gross
- Optional **custom breakdown** override for Basic / HRA / Special Allowance.
- Deductions: configurable PF rate (default 12%, optional ₹15,000 wage
  ceiling), flat Professional Tax, and an editable TDS estimate.
- Indian Rupee formatting (`₹ x,xx,xxx`) and automatic **amount-in-words**
  conversion using the Indian numbering system (Lakh / Crore).
- A polished, enterprise-style payslip preview with a letterhead, signature
  area, seal placeholder and confidentiality footer.
- **Print / Download as PDF** via a dedicated print stylesheet — click
  "Download PDF" or "Print" and choose "Save as PDF" as the destination.
  Only the payslip is rendered on the A4 page; the form and app chrome are
  hidden automatically.
- Fully responsive: side-by-side layout on desktop, tabbed "Edit details /
  Preview slip" view on mobile.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Deploy to Vercel

1. Push this project to a Git repository (GitHub/GitLab/Bitbucket).
2. Import the repository in [Vercel](https://vercel.com/new).
3. Framework preset: **Next.js** (auto-detected). No environment variables
   are required.
4. Deploy — the app builds cleanly with `next build` out of the box.

## Project structure

```
app/
  layout.tsx        Root layout, font loading, metadata
  page.tsx           Page state, calculation wiring, layout, print actions
  globals.css        Design tokens, base styles, print stylesheet
components/
  PayslipForm.tsx    Grouped input form
  PayslipPreview.tsx Payslip document preview
lib/
  types.ts           Shared TypeScript types
  calculations.ts    Salary breakdown & deduction calculation engine
  numberToWords.ts   Indian-numbering-system amount-in-words converter
  format.ts          Currency/date/month formatting helpers
```

## Notes on the calculation model

This tool implements a **simplified, commonly used** payroll model for
illustrative/professional payslip generation. It is not a substitute for
statutory payroll software — Professional Tax slabs vary by state, PF rules
have additional nuances (employer contribution, EPS split, etc.), and TDS
depends on the employee's full tax computation. Adjust the deduction
overrides as needed for your organization's actual policy.
