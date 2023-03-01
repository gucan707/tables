import Router from "koa-router";
import { createTable } from "../handlers/tables/cretateTable";

export const tableRouter = new Router();

tableRouter.post("/", createTable);
