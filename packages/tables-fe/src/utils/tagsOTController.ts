import { MultiSelectOT, TextOT } from "@tables/ot";
import {
  MultiSelectOTData,
  OpsEmitedFromBeArgs,
  ReplaceGridContentArgs,
  ReqAddOps,
  ReqAddTagsOps,
} from "@tables/types";

export type OTInfo = {
  OT: MultiSelectOT;
  gridId: string;
  reason: OTReason;
  hasSendToBe: boolean;
};

export enum OTReason {
  Init,
  /** 点击 option 且当前 option 已被选中（或者按下 backspace 按键），视为 delete */
  Delete,
  /** 点击 option 且当前 option 未被选中，视为 add */
  Add,
}
export class TagsOTController {
  otInfo: OTInfo[] = [];

  static current: TagsOTController;
  /** 后端发来的还未被前端应用的 OT */
  static unAppliedOT: Record<string, OpsEmitedFromBeArgs<MultiSelectOTData>[]> =
    {};
  /** 前端已完成，但是后端还未广播给前端的 OT */
  static unEmitedOT: Record<string, ReqAddTagsOps[] | undefined> = {};

  getLast(): OTInfo | undefined {
    const len = this.otInfo.length;
    const lastOt = this.otInfo[len - 1];
    return lastOt;
  }

  /** 只要发生了 change 就可以调用，create 内部来判断需不需要复用 */
  createOT(gridId: string, baseData: MultiSelectOTData[], reason: OTReason) {
    // debugger;
    const lastOt = this.getLast();
    if (lastOt && !lastOt.OT.ops.length) {
      this.otInfo.pop();
    }
    if (lastOt && lastOt.reason === OTReason.Add && reason === OTReason.Add) {
      // 如果上次与这次均为 add，必定是连续 add，也就是不存在[光标移动]，不需要产生新 OT，只需要更新 ops 即可
      return lastOt;
    }
    const newOt: OTInfo = {
      gridId,
      OT: new MultiSelectOT(baseData),
      reason,
      hasSendToBe: false,
    };

    this.otInfo.push(newOt);
    return newOt;
  }
}
