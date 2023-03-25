import { TextOT } from "@tables/ot";
import { OpsEmitedFromBeArgs, ReqAddOps } from "@tables/types";

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
  /** 后端发来的还未被前端应用的 OT */
  static unAppliedOT: Record<string, OpsEmitedFromBeArgs<string>[]> = {};
  /** 前端已完成，但是后端还未广播给前端的 OT */
  static unEmitedOT: Record<string, ReqAddOps[] | undefined> = {};

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
