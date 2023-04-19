import { ReqDeleteRow } from "@tables/types";

import { request } from "../request";
import { TABLE_BASE_URL } from "../url";

export async function delRow(req: ReqDeleteRow) {
  const url = `/${TABLE_BASE_URL}/${req.tableId}/row/${req.rowId}`;
  await request({
    url,
    method: "DELETE",
  });
}
