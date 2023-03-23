import { TextOT } from "@tables/ot";

export type OTInfo = {
  OT: TextOT;
  gridId: string;
  reason: OTReason;
};

export enum OTReason {
  Init,
  CursorMove,
  Delete,
}
export class OTController {
  otInfo: OTInfo[] = [];

  static current: OTController;

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
    };

    if (lastOt && !lastOt.OT.ops.length) {
      this.otInfo.pop();
    }
    this.otInfo.push(newOt);
    return newOt;
  }
}
