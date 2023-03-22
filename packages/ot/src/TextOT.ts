import { Operator, OperatorType } from "@tables/types";

import { OT1D } from "./";

export class TextOT extends OT1D<string> {
  baseData: string = "";

  checkInsertedDataValiable(op: Operator<string>) {
    return op.data !== "";
  }

  mergeInsert(op1: Operator<string>, op2: Operator<string>): void {
    if (op1.type !== OperatorType.Insert || op2.type !== OperatorType.Insert) {
      console.error("mergeInsert error: 存在非 insert 类型的 op");
      return;
    }

    op1.data += op2.data;
  }
}
