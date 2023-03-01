import Router from "koa-router";
import { userRouter } from "./user";
import { tableRouter } from "./table";

const router = new Router();

router.use("/user", userRouter.routes());
router.use("/table", tableRouter.routes());

export default router;
