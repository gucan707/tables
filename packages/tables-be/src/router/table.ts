import Router from "koa-router";
import { addCollaborators } from "../handlers/tables/addCollaborators";
import { createTable } from "../handlers/tables/cretateTable";

export const tableRouter = new Router();

tableRouter.post("/collaborator", addCollaborators).post("/", createTable);
