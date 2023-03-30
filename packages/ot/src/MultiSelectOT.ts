import { MultiSelectOTData, Operator, OperatorType } from "@tables/types";

import { OT1D } from "./";

export class MultiSelectOT extends OT1D<MultiSelectOTData> {
  baseData: MultiSelectOTData[];

  constructor() {
    super();
    this.baseData = [];
  }
  mergeInsert(
    op1: Operator<MultiSelectOTData>,
    op2: Operator<MultiSelectOTData>
  ): void {
    if (op1.type !== OperatorType.Insert || op2.type !== OperatorType.Insert) {
      console.error("mergeInsert error: 存在非 insert 类型的 op");
      return;
    }
    op1.data.push(...op2.data);
  }

  checkInsertedDataValiable(op: Operator<MultiSelectOTData>): boolean {
    return !!(op.data && op.data.length !== 0);
  }

  apply(orignal: MultiSelectOTData[]): MultiSelectOTData[] {
    const ot = this;

    if (orignal.length !== ot.baseLength) {
      console.log("apply", orignal, ot);
      console.error("MultiSelectOT apply error: baselength !== orignal.length");
      throw new Error();
    }

    const ops = ot.ops;
    let result: MultiSelectOTData[] = [];
    let index = 0;

    ops.forEach((op) => {
      if (op.type === OperatorType.Retain) {
        if (index + op.count > orignal.length) {
          throw new Error(
            "MultiSelectOT apply error: retain too many characters"
          );
        }
        result.push(...orignal.slice(index, index + op.count));
        index += op.count;
      } else if (op.type === OperatorType.Insert) {
        result.push(...op.data);
      } else {
        index += op.count;
      }
    });
    if (result.length !== orignal.length) {
      throw new Error(
        "MultiSelectOT apply error: the ot can't operate on the whole data"
      );
    }

    return result;
  }
}
