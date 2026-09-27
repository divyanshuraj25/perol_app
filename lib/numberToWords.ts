const BELOW_TWENTY = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function twoDigitsToWords(value: number): string {
  if (value === 0) return "";
  if (value < 20) return BELOW_TWENTY[value];
  const tensDigit = Math.floor(value / 10);
  const unit = value % 10;
  return TENS[tensDigit] + (unit ? ` ${BELOW_TWENTY[unit]}` : "");
}

function threeDigitsToWords(value: number): string {
  const hundreds = Math.floor(value / 100);
  const remainder = value % 100;
  let words = "";
  if (hundreds) {
    words += `${BELOW_TWENTY[hundreds]} Hundred`;
  }
  if (hundreds && remainder) {
    words += " ";
  }
  if (remainder) {
    words += twoDigitsToWords(remainder);
  }
  return words;
}

/**
 * Converts a non-negative integer into words using the Indian numbering
 * system (Crore / Lakh / Thousand / Hundred), e.g. 4523200 ->
 * "Forty-Five Lakh Twenty-Three Thousand Two Hundred".
 */
export function numberToWordsIndian(input: number): string {
  const value = Math.floor(Math.abs(input || 0));
  if (value === 0) return "Zero";

  let remainder = value;
  const crore = Math.floor(remainder / 10000000);
  remainder %= 10000000;
  const lakh = Math.floor(remainder / 100000);
  remainder %= 100000;
  const thousand = Math.floor(remainder / 1000);
  remainder %= 1000;
  const hundred = remainder;

  const parts: string[] = [];
  if (crore) parts.push(`${threeDigitsToWords(crore)} Crore`);
  if (lakh) parts.push(`${twoDigitsToWords(lakh)} Lakh`);
  if (thousand) parts.push(`${twoDigitsToWords(thousand)} Thousand`);
  if (hundred) parts.push(threeDigitsToWords(hundred));

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

/**
 * Formats a rupee amount as a payslip-style words line, e.g.
 * "Rupees Forty-Five Thousand Two Hundred Only".
 */
export function amountInWords(amount: number): string {
  const rupees = Math.round(amount || 0);
  return `Rupees ${numberToWordsIndian(rupees)} Only`;
}
