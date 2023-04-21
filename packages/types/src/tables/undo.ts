import { PutHeadAttributesArgs } from "../socket";

export enum UndoType {
  /** 列的增删 */
  Column,
  /** 列的类型修改 */
  ColumnType,
  /** 列的属性修改 */
  HeadAttributes,
  /** 行的增删 */
  Row,
}

type UndoColumn = {
  type: UndoType.Column;
  isDelete: boolean;
  headId: string;
};

type UndoColumnType = {
  type: UndoType.ColumnType;
  /** 修改类型后得到的headId，undo 时需要删除 */
  shouldDeleteHead: string;
  /** 修改类型前的headId，undo 时需要恢复 */
  shouldRestoreHead: string;
};

type UndoHeadAttributes = PutHeadAttributesArgs & {
  type: UndoType.HeadAttributes;
};

type UndoRow = {
  type: UndoType.Row;
  isDeleted: boolean;
  rowId: string;
};

export type UndoStackData =
  | UndoColumn
  | UndoColumnType
  | UndoHeadAttributes
  | UndoRow;
