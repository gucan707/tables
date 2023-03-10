export type Changes = {
  _id: string;
  tableId: string;
  rowId: string;
  gridId: string;
  ops: [];
  author: string;
  /** 修改应用前后的版本 */
  oldVersion: number;
  newVersion: number;
  time: number;
};
