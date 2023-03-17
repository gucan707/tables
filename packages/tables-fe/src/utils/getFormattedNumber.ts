import { NumberFormatDecimal, NumberFormatPercent } from "@tables/types";

export function getFormattedNumber(
  num: number,
  decimal: NumberFormatDecimal,
  percent: NumberFormatPercent
) {
  const n = percent === NumberFormatPercent.Percent ? num * 100 : num;
  let s = n.toFixed(decimal);
  return s + (percent === NumberFormatPercent.Percent ? "%" : "");
}
