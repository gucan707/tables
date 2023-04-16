import { Operator, OperatorType, RowOTData } from "@tables/types";

import { OT1D } from "./";

export class RowOT extends OT1D<RowOTData> {
  baseData: RowOTData[];

  constructor(baseData?: RowOTData[]) {
    super();
    this.baseData = baseData || [];
  }

  mergeInsert(op1: Operator<RowOTData>, op2: Operator<RowOTData>): void {
    if (op1.type !== OperatorType.Insert || op2.type !== OperatorType.Insert) {
      console.error("mergeInsert error: 存在非 insert 类型的 op");
      return;
    }
    op1.data.push(...op2.data);
  }

  checkInsertedDataValiable(op: Operator<RowOTData>): boolean {
    return !!(op.data && op.data.length !== 0);
  }

  apply(orignal: RowOTData[]): RowOTData[] {
    const ot = this;

    if (orignal.length !== ot.baseLength) {
      console.log("apply", orignal, ot);
      console.error("RowOTData apply error: baselength !== orignal.length");
      throw new Error();
    }

    const ops = ot.ops;
    let result: RowOTData[] = [];
    let index = 0;

    ops.forEach((op) => {
      if (op.type === OperatorType.Retain) {
        if (index + op.count > orignal.length) {
          throw new Error("RowOTData apply error: retain too many characters");
        }
        result.push(...orignal.slice(index, index + op.count));
        index += op.count;
      } else if (op.type === OperatorType.Insert) {
        result.push(...op.data);
      } else {
        index += op.count;
      }
    });
    if (index !== orignal.length) {
      throw new Error(
        "RowOTData apply error: the ot can't operate on the whole data"
      );
    }

    return result;
  }
}
