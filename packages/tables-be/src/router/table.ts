import Router from "koa-router";

import { addCollaborators } from "../handlers/tables/addCollaborators";
import { addOps } from "../handlers/tables/addOps";
import { createTable } from "../handlers/tables/cretateTable";
import { getTableDetail } from "../handlers/tables/getTableDetail";
import { getTables } from "../handlers/tables/getTables";

export const tableRouter = new Router();

tableRouter
  .post("/collaborator", addCollaborators)
  .post("/:tableId/addOps", addOps)
  .get("/:tableId", getTableDetail)
  .post("/", createTable)
  .get("/", getTables);
