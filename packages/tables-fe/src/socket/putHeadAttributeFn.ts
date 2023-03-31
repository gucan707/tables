import { PutHeadAttributesArgs } from "@tables/types";

import { setHeadAttribute } from "../redux/headsSlice";
import { store } from "../redux/store";

export const putHeadAttributeFn = (args: PutHeadAttributesArgs) => {
  store.dispatch(setHeadAttribute(args));
};
