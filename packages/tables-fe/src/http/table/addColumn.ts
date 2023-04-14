import { ReqAddColumn } from "@tables/types";

import { request } from "../request";
import { TABLE_BASE_URL } from "../url";

export async function addColumn(req: ReqAddColumn) {
  const url = `/${TABLE_BASE_URL}/${req.tableId}/column`;
  await request({
    url,
    method: "POST",
  });
}
