export enum TableColumnTypes {
  Text,
  Checkbox,
  Select,
  MultiSelect,
  Date,
  Number,
}

/** 一个表头格子的类型 */
export type TableHead = {
  id: string;
  type: TableColumnTypes;
  /** 格子里的文本名字 */
  name: string;
};

export type TableHeads = TableHead[];
