import { MultiSelectOTData, Operator, RowOTData } from "../../ot";
import {
  CheckboxType,
  CommonAtrributes,
  DateType,
  Grid,
  NumberType,
  SelectType,
  Table,
  TableColumnTypes,
  TableHead,
  TableTagColors,
  UndoStackData,
} from "../../tables";
import { UserToken } from "../../users";

export type ResCreateTable = Table;
export type ReqAddCollaborators = {
  /** 合作者id */
  _ids: string[];
  /** 表格id */
  tableId: string;
};

export type ReqGetTables = {
  page: number;
};

export type ResGetTables = Table[];

export type ReqGetTableDetail = {
  tableId: string;
};

export type ResGetTableDetail = Table;

export type ReqGetOnlineUsers = {
  tableId: string;
};

export type ResGetOnlineUsers = UserToken[];

// TODO 多选协同类型复用
export type ReqAddOps = {
  feId: string;
  rowId: string;
  gridId: string;
  basedVersion: number;
  ops: Operator<string>[];
};

export type ReqAddTagsOps = {
  feId: string;
  rowId: string;
  gridId: string;
  basedVersion: number;
  tagsOps: Operator<MultiSelectOTData>[];
};

export type ReqAddRowOps = {
  feId: string;
  basedVersion: number;
  rowOps: Operator<RowOTData>[];
};

export type ReqPutGridContent = {
  tableId: string;
  rowId: string;
  gridId: string;
} & GetOmitCommon<CheckboxType | SelectType | DateType | NumberType>;

type GetOmitCommon<T extends Grid> = T extends Grid
  ? Omit<T, keyof CommonAtrributes>
  : never;

type GetHeadOmitId<T> = T extends TableHead ? Omit<T, "_id" | "tags"> : never;

export type ReqPutHeadAttributes = {
  tableId: string;
  headId: string;
} & GetHeadOmitId<TableHead>;

export type ReqPutTag = {
  tableId: string;
  tagId: string;
  headId: string;
  text: string;
  color: TableTagColors;
};

export type ReqPostTag = Omit<ReqPutTag, "tagId">;

export type ReqAddColumn = {
  tableId: string;
};

export type ReqAddRow = {
  tableId: string;
};

export type ReqDeleteRow = {
  tableId: string;
  rowId: string;
};

export type ReqDelColumn = {
  tableId: string;
  headId: string;
};

export type ReqGetColumn = {
  tableId: string;
  headId: string;
  rowIds: string[];
};

export type ResGetColumnItem = {
  rowId: string;
  grid: Grid;
};

export type ResGetColumn = {
  data: ResGetColumnItem[];
  head: TableHead;
  beforeHeadId?: string;
};

export type ReqPutColumnType = {
  tableId: string;
  headId: string;
  type: TableColumnTypes;
};

export type ReqUndo = {
  tableId: string;
} & UndoStackData;
