import Router from "koa-router";

import { addCollaborators } from "../handlers/tables/addCollaborators";
import { createTable } from "../handlers/tables/cretateTable";
import { getTableDetail } from "../handlers/tables/getTableDetail";
import { getTables } from "../handlers/tables/getTables";

export const tableRouter = new Router();

tableRouter
  .post("/collaborator", addCollaborators)
  .get("/:tableId", getTableDetail)
  .post("/", createTable)
  .get("/", getTables);
