import { OT1D, TextOT } from "@tables/ot";
import { OperatorType } from "@tables/types";

test("transform: baseVer equal", () => {
  const ot1 = new TextOT(),
    ot2 = new TextOT();
  ot1
    .addOp({
      type: OperatorType.Retain,
      count: 8,
    })
    .addOp({
      type: OperatorType.Insert,
      data: "1",
    });

  ot2
    .addOp({
      type: OperatorType.Retain,
      count: 8,
    })
    .addOp({
      type: OperatorType.Insert,
      data: "2",
    });

  const [ot1P, ot2P] = OT1D.transform(ot1, ot2, TextOT);

  const exceptOt1P = new TextOT(),
    exceptOt2P = new TextOT();
  exceptOt1P
    .addOp({
      type: OperatorType.Retain,
      count: 8,
    })
    .addOp({
      type: OperatorType.Insert,
      data: "1",
    })
    .addOp({
      type: OperatorType.Retain,
      count: 1,
    });

  exceptOt2P
    .addOp({
      type: OperatorType.Retain,
      count: 9,
    })
    .addOp({
      type: OperatorType.Insert,
      data: "2",
    });

  expect(ot1P.ops).toEqual(exceptOt1P.ops);
  expect(ot1P.baseLength).toEqual(exceptOt1P.baseLength);
  expect(ot1P.targetLength).toEqual(exceptOt1P.targetLength);

  expect(ot2P.ops).toEqual(exceptOt2P.ops);
  expect(ot2P.baseLength).toEqual(exceptOt2P.baseLength);
  expect(ot2P.targetLength).toEqual(exceptOt2P.targetLength);
});
