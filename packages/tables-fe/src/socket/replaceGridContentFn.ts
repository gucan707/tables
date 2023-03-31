import { ReplaceGridContentArgs } from "@tables/types";

import { addContent } from "../redux/shouldReplacedContentSlice";
import { store } from "../redux/store";

export const replaceGridContentFn = (args: ReplaceGridContentArgs) => {
  store.dispatch(addContent(args));
};
