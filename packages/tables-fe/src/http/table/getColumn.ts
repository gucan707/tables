import { ReqGetColumn, ResGetColumn } from "@tables/types";

import { request } from "../request";
import { TABLE_BASE_URL } from "../url";

export async function getColumn(req: ReqGetColumn) {
  const url = `/${TABLE_BASE_URL}/${req.tableId}/getColumn`;

  const res = await request<ResGetColumn, ReqGetColumn>({
    url,
    method: "POST",
    data: req,
  });

  return res;
}
