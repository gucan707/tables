import { Message } from "@arco-design/web-react";
import { ReqPutTag } from "@tables/types";

import { request } from "../request";
import { TABLE_BASE_URL } from "../url";

export async function putTag(req: ReqPutTag) {
  const PUT_TAG_URL = `/${TABLE_BASE_URL}/${req.headId}/tags`;

  const res = await request<string, ReqPutTag>({
    url: PUT_TAG_URL,
    method: "PUT",
    data: req,
  });

  if (res) {
    Message.success("修改成功");
  }
}
