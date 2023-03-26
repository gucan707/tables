import Router from "koa-router";

import { addCollaborators } from "../handlers/tables/addCollaborators";
import { addOps } from "../handlers/tables/addOps";
import { createTable } from "../handlers/tables/cretateTable";
import { getTableDetail } from "../handlers/tables/getTableDetail";
import { getTables } from "../handlers/tables/getTables";
import { putGridContent } from "../handlers/tables/putGridContent";

export const tableRouter = new Router();

tableRouter
  .post("/collaborator", addCollaborators)
  .post("/:tableId/addOps", addOps)
  .put("/:tableId/putGridContent", putGridContent)
  .get("/:tableId", getTableDetail)
  .post("/", createTable)
  .get("/", getTables);
