export enum TableColumnTypes {
  Text = "文本",
  Checkbox = "复选框",
  Select = "单选",
  MultiSelect = "多选",
  Date = "日期",
  Number = "数字",
}

/** 一个表头格子的类型 */
export type TableHead = {
  _id: string;
  type: TableColumnTypes;
  /** 格子里的文本名字 */
  name: string;
};

export type TableHeads = TableHead[];
