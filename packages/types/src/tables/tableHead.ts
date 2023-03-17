import {
  DateFormatOptions,
  NumberFormatDecimal,
  NumberFormatPercent,
  SelectOptionType,
} from "./grid";

export enum TableColumnTypes {
  Text = "文本",
  Checkbox = "复选框",
  Select = "单选",
  MultiSelect = "多选",
  Date = "日期",
  Number = "数字",
}

export type CommonHeadAttributes = {
  _id: string;
  name: string;
};

export type TextHead = {
  type: TableColumnTypes.Text;
} & CommonHeadAttributes;

export type CheckboxHead = {
  type: TableColumnTypes.Checkbox;
} & CommonHeadAttributes;

export type SelectHead = {
  type: TableColumnTypes.Select;
  tags: SelectOptionType[];
} & CommonHeadAttributes;

export type MultiSelectHead = {
  type: TableColumnTypes.MultiSelect;
  tags: SelectOptionType[];
} & CommonHeadAttributes;

export type DateHead = {
  type: TableColumnTypes.Date;
  format: DateFormatOptions;
} & CommonHeadAttributes;

export type NumberHead = {
  type: TableColumnTypes.Number;
  /** 小数位数 */
  decimal: NumberFormatDecimal;
  /** 百分比格式 */
  percent: NumberFormatPercent;
} & CommonHeadAttributes;

/** 一个表头格子的类型 */
export type TableHead =
  | TextHead
  | CheckboxHead
  | SelectHead
  | MultiSelectHead
  | DateHead
  | NumberHead;

export type TableHeads = TableHead[];
