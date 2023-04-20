import { ReqUndo } from "@tables/types";

import { request } from "../request";
import { TABLE_BASE_URL } from "../url";

export async function undo(req: ReqUndo) {
  const url = `/${TABLE_BASE_URL}/${req.tableId}/undo`;
  await request<string, ReqUndo>({
    url,
    method: "PUT",
    data: req,
  });
}
