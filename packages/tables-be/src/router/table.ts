import Router from "koa-router";

import { addCollaborators } from "../handlers/tables/addCollaborators";
import { addColumn } from "../handlers/tables/addColumn";
import { addOps } from "../handlers/tables/addOps";
import { addRow } from "../handlers/tables/addRow";
import { addTagsOps } from "../handlers/tables/addTagsOps";
import { createTable } from "../handlers/tables/cretateTable";
import { delColumn } from "../handlers/tables/delColumn";
import { deleteRow } from "../handlers/tables/deleteRow";
import { getTableDetail } from "../handlers/tables/getTableDetail";
import { getTables } from "../handlers/tables/getTables";
import { postTag } from "../handlers/tables/postTag";
import { putColumnType } from "../handlers/tables/putColumnType";
import { putGridContent } from "../handlers/tables/putGridContent";
import { putHeadAttributes } from "../handlers/tables/putHeadAttributes";
import { putTag } from "../handlers/tables/putTag";
import { undo } from "../handlers/tables/undo";

export const tableRouter = new Router();

tableRouter
  .post("/collaborator", addCollaborators)
  .post("/:tableId/addOps", addOps)
  .post("/:tableId/addTagsOps", addTagsOps)
  .post("/:tableId/column", addColumn)
  .put("/:tableId/column", putColumnType)
  .delete("/:tableId/column/:headId", delColumn)
  .post("/:tableId/row", addRow)
  .delete("/:tableId/row/:rowId", deleteRow)
  .put("/:tableId/undo", undo)
  .put("/:tableId/putGridContent", putGridContent)
  .put("/:tableId/putHeadAttributes", putHeadAttributes)
  .put("/:tableId/tags", putTag)
  .post("/:tableId/tags", postTag)
  .get("/:tableId", getTableDetail)
  .post("/", createTable)
  .get("/", getTables);
