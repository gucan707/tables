import { DelColumnArgs } from "@tables/types";

import { delHead } from "../redux/headsSlice";
import { store } from "../redux/store";

export const delColumnFn = (args: DelColumnArgs) => {
  store.dispatch(delHead(args));
};
