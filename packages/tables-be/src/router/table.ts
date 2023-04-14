import Router from "koa-router";

import { addCollaborators } from "../handlers/tables/addCollaborators";
import { addColumn } from "../handlers/tables/addColumn";
import { addOps } from "../handlers/tables/addOps";
import { addTagsOps } from "../handlers/tables/addTagsOps";
import { createTable } from "../handlers/tables/cretateTable";
import { delColumn } from "../handlers/tables/delColumn";
import { getTableDetail } from "../handlers/tables/getTableDetail";
import { getTables } from "../handlers/tables/getTables";
import { postTag } from "../handlers/tables/postTag";
import { putGridContent } from "../handlers/tables/putGridContent";
import { putHeadAttributes } from "../handlers/tables/putHeadAttributes";
import { putTag } from "../handlers/tables/putTag";

export const tableRouter = new Router();

tableRouter
  .post("/collaborator", addCollaborators)
  .post("/:tableId/addOps", addOps)
  .post("/:tableId/addTagsOps", addTagsOps)
  .post("/:tableId/column", addColumn)
  .delete("/:tableId/column/:headId", delColumn)
  .put("/:tableId/putGridContent", putGridContent)
  .put("/:tableId/putHeadAttributes", putHeadAttributes)
  .put("/:tableId/tags", putTag)
  .post("/:tableId/tags", postTag)
  .get("/:tableId", getTableDetail)
  .post("/", createTable)
  .get("/", getTables);
