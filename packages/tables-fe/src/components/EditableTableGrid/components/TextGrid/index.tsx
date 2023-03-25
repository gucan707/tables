import { FC, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { OT1D, TextOT } from "@tables/ot";
import { Operator, OperatorType, TextType } from "@tables/types";

import { CommonGridProps } from "../..";
import { addOps } from "../../../../http/table/addOps";
import { changeActiveGridId } from "../../../../redux/activeGridSlice";
import { useAppDispatch } from "../../../../redux/store";
import { checkMoveCursorKey, KeyStr } from "../../../../utils/keyStr";
import { OTController, OTReason } from "../../../../utils/OTsController";

export type TextGridProps = {
  grid: TextType;
} & CommonGridProps;

export const TextGrid: FC<TextGridProps> = (props) => {
  const { grid, isActive, rowId, shouldAppliedOT } = props;
  const { tableId } = useParams();
  const [text, setText] = useState(grid.text);
  const versionRef = useRef<number>(grid.version);
  const isInputZh = useRef(false);
  const dispatch = useAppDispatch();
  const otRef = useRef<TextOT>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isActive) return;
    const ot = OTController.current.createOT(
      grid._id,
      grid.text,
      OTReason.Init
    );
    otRef.current = ot.OT;
  }, [isActive]);

  useEffect(() => {
    if (!inputRef.current || !isActive) return;
    inputRef.current.focus();
  }, [inputRef.current, isActive]);

  useEffect(() => {
    if (!shouldAppliedOT) return;
    const localOT = OTController.current.otInfo.filter(
      (ot) => ot.gridId === grid._id
    );

    if (!localOT.length || !localOT[0].OT.ops.length) {
      shouldAppliedOT.forEach((otInfo) => {
        const ot = new TextOT();
        otInfo.ops.forEach((op) => ot.addOp(op));
        setText((text) => ot.apply(text));
        versionRef.current = otInfo.oldVersion + 1;
      });
    } else {
      const localComposedOT = OT1D.composeOts(
        localOT.map((ot) => ot.OT),
        TextOT
      );

      if (!localComposedOT) return;
      let localOTPrime = localComposedOT;
      shouldAppliedOT.forEach((otInfo) => {
        const ot = OT1D.createOTByOps(otInfo.ops, TextOT);
        if (ot) {
          const [localP, otPrime] = OT1D.transform(localOTPrime, ot, TextOT);
          localOTPrime = localP;
          setText((text) => otPrime.apply(text));
          versionRef.current = otInfo.oldVersion + 1;
        }
      });
    }

    console.log(versionRef.current);
  }, [shouldAppliedOT]);

  return isActive ? (
    <input
      type="text"
      value={text}
      ref={inputRef}
      onChange={(e) => {
        if (!isInputZh.current) {
          otRef.current && diffStr(e.target.value, otRef.current);
        }
        setText(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === KeyStr.Delete || e.key === KeyStr.Backspace) {
          const ot = OTController.current.createOT(
            grid._id,
            text,
            OTReason.Delete
          );
          otRef.current = ot.OT;
        }
        if (checkMoveCursorKey(e.key)) {
          const ot = OTController.current.createOT(
            grid._id,
            text,
            OTReason.CursorMove
          );
          otRef.current = ot.OT;
        }
      }}
      onClick={(e) => {
        const ot = OTController.current.createOT(
          grid._id,
          text,
          OTReason.CursorMove
        );
        otRef.current = ot.OT;
      }}
      onCompositionStart={() => {
        isInputZh.current = true;
      }}
      onCompositionEnd={(e) => {
        otRef.current &&
          diffStr((e.target as HTMLInputElement).value, otRef.current);
        isInputZh.current = false;
      }}
      onBlur={() => {
        dispatch(changeActiveGridId(""));
        addOps(grid._id, tableId || "", versionRef.current, rowId);
      }}
    />
  ) : (
    <div>{text}</div>
  );
};

function diffStr(s2: string, ot: TextOT) {
  const s1 = ot.baseData;
  // debugger;
  console.log({ s1, s2 });

  if (s1 === s2) return;
  ot.init();

  if (s1 === "") {
    ot.addOp({ type: OperatorType.Insert, data: s2 });
    return;
  }

  if (s2 === "") {
    ot.addOp({ type: OperatorType.Delete, count: s1.length });
    return;
  }
  let start1 = 0;
  for (; start1 < s1.length; start1++) {
    if (s1[start1] !== s2[start1]) break;
  }
  start1--;
  let end1 = s1.length - 1;
  let end2 = s2.length - 1;
  for (; end1 > start1 && end2 > start1; end1--, end2--) {
    if (s1[end1] !== s2[end2]) break;
  }
  end1++;
  end2++;

  // 起始 retain
  ot.addOp({
    type: OperatorType.Retain,
    count: start1 + 1,
  });

  // 如果有 delete 操作，那一定为如下属性
  const deleteOp: Operator<string> = {
    type: OperatorType.Delete,
    count: end1 - start1 - 1,
  };

  // 如果有 insert 操作，那一定为如下属性
  const insertOp: Operator<string> = {
    type: OperatorType.Insert,
    data: s2.slice(start1 + 1, end2),
  };

  if (end2 > end1) {
    // s2 长，必定有 insert
    ot.addOp(insertOp);
    if (end1 !== start1 + 1) {
      // s1 中存在 delete 缺失
      ot.addOp(deleteOp);
    }
  } else if (end2 < end1) {
    // s2 短，必定有 delete
    ot.addOp(deleteOp);
    if (end2 !== start1 + 1) {
      // s2 中存在 insert 的数据
      ot.addOp(insertOp);
    }
  } else {
    // delete === insert
    ot.addOp(deleteOp).addOp(insertOp);
  }

  // 末尾 retain
  ot.addOp({
    type: OperatorType.Retain,
    count: s1.length - end1,
  });
}

/**
 * 1. insert
 * 12345 -> 12abc345
 * start1 = 1, end1 = 2, end2 = 5
 * end2 > end1 && end1 = start1 + 1
 *
 * 2. delete
 * 12345 -> 145
 * start = 0, end1 = 3, end2 = 1
 * end2 < end1 && end2 = start1 + 1
 *
 * 3. delete > insert
 * 12345 -> 1a5
 * start1 = 0, end1 = 4, end2 = 2
 * end2 < end1
 *
 *
 * 4. delete === insert
 * 12345 -> 1abc5
 * start1 = 0, end1 = 4, end2 === 4
 * end1 === end2
 *
 * 5. delete < insert
 * 12345 -> 12abc45
 * start1 = 1, end1 = 3, end2 = 5
 * end2 > end1
 */
