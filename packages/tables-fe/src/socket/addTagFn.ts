import { AddTagArgs } from "@tables/types";

import { addTag } from "../redux/headsSlice";
import { store } from "../redux/store";

export const addTagFn = (args: AddTagArgs) => {
  store.dispatch(addTag(args));
};
