import { Message } from "@arco-design/web-react";
import { ReqPostTag } from "@tables/types";

import { request } from "../request";
import { TABLE_BASE_URL } from "../url";

export async function postTag(req: ReqPostTag) {
  const POST_TAG_URL = `/${TABLE_BASE_URL}/${req.tableId}/tags`;
  const res = await request<string, ReqPostTag>({
    url: POST_TAG_URL,
    method: "POST",
    data: req,
  });
  if (res) {
    Message.success("增加成功");
  }
}
