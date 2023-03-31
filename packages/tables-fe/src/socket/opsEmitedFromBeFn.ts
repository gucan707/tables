import { MutableRefObject } from "react";

import { OpsEmitedFromBeArgs, Table } from "@tables/types";

import { pushOT } from "../redux/shouldAppliedOTSlice";
import { store } from "../redux/store";
import { OTController } from "../utils/OTsController";

export const opsEmitedFromBeFn = (
  args: OpsEmitedFromBeArgs<string>,
  tableDetailCopyRef: MutableRefObject<Table | undefined> | null | undefined
) => {
  console.log("Events.OpsEmitedFromBe", args);

  const { unAppliedOT } = OTController;
  if (!unAppliedOT[args.gridId]) {
    unAppliedOT[args.gridId] = [];
  }
  const curGrid = tableDetailCopyRef?.current?.rows
    .find((row) => row._id === args.rowId)
    ?.data.find((grid) => grid._id === args.gridId);

  if (!curGrid) {
    // TODO 可能是新增的格子，表格层面协同时需要再修改
    console.error("Events.OpsEmitedFromBe: !curGrid");
    return;
  }

  const ots = unAppliedOT[args.gridId];

  ots.push(args);
  ots.sort((a, b) => a.oldVersion - b.oldVersion);
  if (ots[0].oldVersion !== curGrid.version) {
    console.log(ots[0].oldVersion, curGrid.version);
    // 版本不连续，缺少了一些修改
    console.warn(
      "Events.OpsEmitedFromBe: ots[0].oldVersion !== curGrid.version"
    );
    return;
  }

  let index = 1;
  while (index < ots.length) {
    if (ots[index].oldVersion === ots[index - 1].oldVersion + 1) {
      index++;
    } else {
      break;
    }
  }
  curGrid.version = ots[index - 1].oldVersion + 1;
  const shouldAppliedOT = ots.splice(0, index);

  store.dispatch(
    pushOT({
      gridId: curGrid._id,
      ots: shouldAppliedOT,
    })
  );
};
