import { TableTagColors } from "./color";
import { TableColumnTypes } from "./tableHead";

export type CommonAtrributes = {
  _id: string;
  /** 对应的列表头的 _id */
  headId: string;
  version: number;
};

/** 文本 */
export type TextType = {
  type: TableColumnTypes.Text;
  text: string;
} & CommonAtrributes;

/** 复选框 */
export type CheckboxType = {
  type: TableColumnTypes.Checkbox;
  checked: boolean;
} & CommonAtrributes;

/** 单选 */
export type SelectType = {
  type: TableColumnTypes.Select;
  /** SelectOptionType 的 id */
  content: string;
} & CommonAtrributes;

/** 选项 tab 类型，用于单多选 */
export type SelectOptionType = {
  _id: string;
  text: string;
  color: TableTagColors;
  headId: string;
};

/** 多选 */
export type MultiSelectType = {
  type: TableColumnTypes.MultiSelect;
  /** SelectOptionType 的 id 数组 */
  contents: string[];
} & CommonAtrributes;

/** 日期 */
export type DateType = {
  type: TableColumnTypes.Date;
  /** 日期时间戳，单位：毫秒 */
  date: number;
  // /** 日期格式化方式 */
  // format: DateFormatOptions;
} & CommonAtrributes;

/** 日期格式化方式 */
export enum DateFormatOptions {
  /** 年月日, 例如: 2023/01/01 */
  YMD = "YYYY/MM/DD",
  /** 年月日时间, 例如: 2023/01/01 11:00 */
  YMDT = "YYYY/MM/DD HH:mm",
  /** 月日, 例如: 01/01 */
  MD = "MM/DD",
  /** 月日时间, 例如: 01/01 11:00 */
  MDT = "MM/DD HH:mm",
}

/** 数字 */
export type NumberType = {
  type: TableColumnTypes.Number;
  content: number;
} & CommonAtrributes;

/** 小数位数 */
export enum NumberFormatDecimal {
  None,
  One,
  Two,
}

/** 百分比格式 */
export enum NumberFormatPercent {
  /** 非百分比 */
  None,
  /** 百分比 */
  Percent,
}

/** 一格数据 */
export type Grid =
  | TextType
  | CheckboxType
  | SelectType
  | MultiSelectType
  | DateType
  | NumberType;

export type Row = {
  _id: string;
  data: Grid[];
  tableId: string;
  isDeleted?: boolean;
};
