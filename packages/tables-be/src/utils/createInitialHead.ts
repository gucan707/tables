import {
  DateFormatOptions,
  NumberFormatDecimal,
  NumberFormatPercent,
  TableColumnTypes,
  TableHead,
} from "@tables/types";

export function createInitialHead(
  _id: string,
  headType: TableColumnTypes
): TableHead | undefined {
  let head: TableHead;

  switch (headType) {
    case TableColumnTypes.Text:
    case TableColumnTypes.Checkbox:
      head = {
        type: headType,
        name: headType,
        _id,
      };
      break;
    case TableColumnTypes.Date:
      head = {
        type: headType,
        _id,
        name: headType,
        format: DateFormatOptions.YMD,
      };
      break;
    case TableColumnTypes.MultiSelect:
    case TableColumnTypes.Select:
      head = {
        type: headType,
        _id,
        name: headType,
        tags: [],
      };
      break;
    case TableColumnTypes.Number:
      head = {
        type: headType,
        _id,
        name: headType,
        decimal: NumberFormatDecimal.None,
        percent: NumberFormatPercent.None,
      };
      break;
    default:
      break;
  }

  return head;
}
