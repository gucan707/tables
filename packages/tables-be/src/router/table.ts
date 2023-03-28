import Router from "koa-router";

import { addCollaborators } from "../handlers/tables/addCollaborators";
import { addOps } from "../handlers/tables/addOps";
import { createTable } from "../handlers/tables/cretateTable";
import { getTableDetail } from "../handlers/tables/getTableDetail";
import { getTables } from "../handlers/tables/getTables";
import { putGridContent } from "../handlers/tables/putGridContent";
import { putHeadAttributes } from "../handlers/tables/putHeadAttributes";

export const tableRouter = new Router();

tableRouter
  .post("/collaborator", addCollaborators)
  .post("/:tableId/addOps", addOps)
  .put("/:tableId/putGridContent", putGridContent)
  .put("/:tableId/putHeadAttributes", putHeadAttributes)
  .get("/:tableId", getTableDetail)
  .post("/", createTable)
  .get("/", getTables);
