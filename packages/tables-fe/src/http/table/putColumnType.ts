import { ReqPutColumnType } from "@tables/types";

import { request } from "../request";
import { TABLE_BASE_URL } from "../url";

export function putColumnType(req: ReqPutColumnType) {
  const url = `/${TABLE_BASE_URL}/${req.tableId}/column`;
  return request<string, ReqPutColumnType>({
    url,
    method: "PUT",
    data: req,
  });
}
