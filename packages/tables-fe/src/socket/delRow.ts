import { DelRowArgs } from "@tables/types";

import { delRowInRedux } from "../redux/rowsSlice";
import { store } from "../redux/store";

export const delRowFn = (args: DelRowArgs) => {
  store.dispatch(delRowInRedux(args));
};
