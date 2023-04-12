import "./index.less";

import { FC, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { OT1D, TextOT } from "@tables/ot";
import { Operator, OperatorType, TextType } from "@tables/types";

import { CommonGridProps } from "../..";
import { addOps } from "../../../../http/table/addOps";
import { useUserInfo } from "../../../../http/user/useUserInfo";
import { changeActiveGridId } from "../../../../redux/activeGridSlice";
import { delOT } from "../../../../redux/shouldAppliedOTSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/store";
import { checkMoveCursorKey, KeyStr } from "../../../../utils/keyStr";
import { OTController, OTReason } from "../../../../utils/OTsController";
import { setupShortcut } from "../../../../utils/setupShortcut";

export type TextGridProps = {
  grid: TextType;
} & CommonGridProps;

export const TextGrid: FC<TextGridProps> = (props) => {
  const { grid, isActive, rowId } = props;
  const { tableId } = useParams();
  const [text, setText] = useState(grid.text);
  const versionRef = useRef<number>(grid.version);
  const isInputZh = useRef(false);
  const dispatch = useAppDispatch();
  const otRef = useRef<TextOT>();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { userInfo } = useUserInfo();
  const shouldAppliedOT = useAppSelector(
    (state) => state.shouldAppliedOT.shouldAppliedOT[grid?._id ?? ""]
  );

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
    grid.text = text;
  }, [text]);

  useEffect(() => {
    if (!inputRef.current || !isActive) return;
    if (inputRef.current === document.activeElement) return;

    inputRef.current.focus();
    inputRef.current.selectionStart = grid.text.length;
    inputRef.current.selectionEnd = grid.text.length;
  }, [inputRef.current, isActive]);

  useEffect(() => {
    if (!shouldAppliedOT || !shouldAppliedOT.length || !userInfo) return;
    if (shouldAppliedOT[0].oldVersion !== versionRef.current) return;
    let index = 1;
    while (index < shouldAppliedOT.length) {
      if (
        shouldAppliedOT[index].oldVersion ===
        shouldAppliedOT[index - 1].oldVersion + 1
      ) {
        index++;
      } else {
        break;
      }
    }

    const ots = [...shouldAppliedOT].splice(0, index);

    const unEmitedOT = OTController.unEmitedOT[grid._id];
    ots.forEach((otInfo) => {
      const ot = OT1D.createOTByOps(otInfo.ops, TextOT);
      if (!ot) return;
      if (!unEmitedOT || !unEmitedOT.length) {
        // 本地没有对该格子进行修改，直接应用
        setText((text) => ot.apply(text));
        versionRef.current = otInfo.oldVersion + 1;
        return;
      }
      const exitedIndex = unEmitedOT.findIndex((o) => o.feId === otInfo.feId);
      if (exitedIndex !== -1) {
        // 收到了后端对该 OT 的广播，版本暂时与后端达成一致，直接 continue
        unEmitedOT.splice(exitedIndex, 1);
        versionRef.current = otInfo.oldVersion + 1;
        return;
      }

      // 是其他人的修改，需要与本地 unEmitedOT 依次 transform 后再 apply
      let transformedOt: TextOT = ot;
      unEmitedOT.forEach((o) => {
        const localOT = OT1D.createOTByOps(o.ops, TextOT);
        if (!localOT) return;
        const [otPrime, _] = OT1D.transform(transformedOt, localOT, TextOT);
        transformedOt = otPrime;
      });
      setText((text) => transformedOt.apply(text));
      versionRef.current = otInfo.oldVersion + 1;
    });
    dispatch(
      delOT({
        gridId: grid._id,
        index,
      })
    );
  }, [shouldAppliedOT, userInfo, grid._id]);

  return isActive ? (
    <textarea
      className="text_grid_input"
      value={text}
      ref={inputRef}
      onFocus={(e) => {
        e.target.style.height = `inherit`;
        e.target.style.height = `${e.target.scrollHeight}px`;
      }}
      onChange={(e) => {
        if (!isInputZh.current) {
          otRef.current && diffStr(e.target.value, otRef.current);
        }
        e.target.style.height = `inherit`;
        e.target.style.height = `${e.target.scrollHeight}px`;
        setText(e.target.value);
      }}
      onKeyDown={(e) => {
        setupShortcut({ e, setText });

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
