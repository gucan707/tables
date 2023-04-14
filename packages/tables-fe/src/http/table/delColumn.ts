import { ReqDelColumn } from "@tables/types";

import { request } from "../request";
import { TABLE_BASE_URL } from "../url";

export async function delColumn(req: ReqDelColumn) {
  const url = `/${TABLE_BASE_URL}/${req.tableId}/column/${req.headId}`;

  await request({
    url,
    method: "DELETE",
  });
}
