import { TextOT } from "@tables/ot";
import { OpsEmitedFromBeArgs } from "@tables/types";

export type OTInfo = {
  OT: TextOT;
  gridId: string;
  reason: OTReason;
  hasSendToBe: boolean;
};

export enum OTReason {
  Init,
  CursorMove,
  Delete,
}
export class OTController {
  otInfo: OTInfo[] = [];

  static current: OTController;
  static unAppliedOT: Record<string, OpsEmitedFromBeArgs<string>[]> = {};

  getLast(): OTInfo | undefined {
    const len = this.otInfo.length;
    const lastOt = this.otInfo[len - 1];
    return lastOt;
  }

  createOT(gridId: string, baseData: string, reason: OTReason) {
    const lastOt = this.getLast();
    const newOt: OTInfo = {
      gridId,
      OT: new TextOT(baseData),
      reason,
      hasSendToBe: false,
    };

    if (lastOt && !lastOt.OT.ops.length) {
      this.otInfo.pop();
    }
    this.otInfo.push(newOt);
    return newOt;
  }
}
