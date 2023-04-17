import { ReqAddRow } from "@tables/types";

import { request } from "../request";
import { TABLE_BASE_URL } from "../url";

export async function addRow(req: ReqAddRow) {
  const url = `/${TABLE_BASE_URL}/${req.tableId}/row`;
  await request({
    url,
    method: "POST",
  });
}
