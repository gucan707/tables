import { ReqAddRow } from "@tables/types";

import { request } from "../request";
import { TABLE_BASE_URL } from "../url";

export function addRow(req: ReqAddRow) {
  const url = `/${TABLE_BASE_URL}/${req.tableId}/row`;
  return request<string>({
    url,
    method: "POST",
  });
}
