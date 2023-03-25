import { Operator, OperatorType } from "@tables/types";

import { OT1D } from "./";

export class TextOT extends OT1D<string> {
  baseData: string = "";

  constructor(baseData?: string) {
    super();
    this.baseData = baseData ?? "";
  }

  checkInsertedDataValiable(op: Operator<string>) {
    return op.data !== "";
  }

  mergeInsert(op1: Operator<string>, op2: Operator<string>): void {
    if (op1.type !== OperatorType.Insert || op2.type !== OperatorType.Insert) {
      console.error("mergeInsert error: 存在非 insert 类型的 op");
      return;
    }

    console.log({ op1, op2 });

    op1.data += op2.data;
  }

  apply(orignal: string): string {
    const ot = this;

    if (orignal.length !== ot.baseLength) {
      console.log("apply", orignal, ot);
      console.error("TextOT apply error: baselength !== orignal.length");
      throw new Error();
    }
    const ops = ot.ops;
    let newStr = "";
    let strIndex = 0;
    console.log(ops);

    ops.forEach((op, index) => {
      if (op.type === OperatorType.Retain) {
        if (strIndex + op.count > orignal.length) {
          throw new Error("TextOT apply error: retain too many characters");
        }
        newStr += orignal.slice(strIndex, strIndex + op.count);
        strIndex += op.count;
      } else if (op.type === OperatorType.Insert) {
        newStr += op.data;
      } else {
        strIndex += op.count;
      }
    });
    if (strIndex !== orignal.length) {
      throw new Error(
        "TextOT apply error: the ot can't operate on the whole str"
      );
    }
    return newStr;
  }
}
