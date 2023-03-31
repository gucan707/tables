import { UpdateTagArgs } from "@tables/types";

import { updateTag } from "../redux/headsSlice";
import { store } from "../redux/store";

export const updateTagFn = (args: UpdateTagArgs) => {
  store.dispatch(updateTag(args));
};
