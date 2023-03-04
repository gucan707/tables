enum OperatorType {
  Insert,
  Delete,
  Retain,
}
type Operator<T> =
  | {
      type: OperatorType.Delete | OperatorType.Retain;
      count: number;
      data?: never;
    }
  | {
      type: OperatorType.Insert;
      count?: never;
      data: T extends string ? T : T[];
    };

abstract class OT1D<T> {
  ops: Operator<T>[] = [];
  baseLength: number = 0;
  targetLength: number = 0;

  /**
   * 合并自己的 insert op
   * @param op1 已经存在的 op
   * @param op2 新增的 op
   */
  abstract mergeInsert(op1: Operator<T>, op2: Operator<T>): void;

  /**
   * 检查新增的 data 是否有效（是否为空等）
   * @param op 新增的 op
   */
  abstract checkInsertedDataValiable(op: Operator<T>): boolean;

  addOp(op: Operator<T>) {
    if (op.count === 0) return;
    if (op.type === OperatorType.Insert && !this.checkInsertedDataValiable(op))
      return;

    const lastIndex = this.ops.length - 1;
    const last = this.ops[lastIndex];
    switch (op.type) {
      case OperatorType.Retain:
        this.baseLength += op.count;
        this.targetLength += op.count;
        if (last && last.type === OperatorType.Retain) {
          last.count += op.count;
        } else {
          this.ops.push(op);
        }
        break;
      case OperatorType.Insert:
        if (last.type === OperatorType.Insert) {
          this.mergeInsert(last, op);
        } else if (last.type === OperatorType.Retain) {
          this.ops.push(op);
        } else {
          if (this.ops[lastIndex - 1]?.type === OperatorType.Insert) {
            this.mergeInsert(this.ops[lastIndex - 1], op);
          }
        }
        break;
      case OperatorType.Delete:
        this.baseLength += op.count;
        if (last && last.type === OperatorType.Delete) {
          last.count += op.count;
        } else {
          this.ops.push(op);
        }
        break;
      default:
        break;
    }
  }

  /** 两个用户的操作转换，具体逻辑见笔记：https://www.notion.so/gcc707/ot-js-5fa6c4eaaea9464084856ed9af1984c9 */
  static transform<U, OT extends new () => OT1D<U>>(
    ot1: OT1D<U>,
    ot2: OT1D<U>,
    OT: OT
  ) {
    /** 转换后被应用到用户2的 ot1 */
    const ot1Prime = new OT();
    /** 转换后被应用到用户1的 ot2 */
    const ot2Prime = new OT();
    const ops1 = ot1.ops,
      ops2 = ot2.ops;
    let i1 = 0,
      i2 = 0;
    let op1 = { ...ops1[i1++] },
      op2 = { ...ops2[i2++] };
    while (1) {
      if (op1 === undefined && op2 === undefined) {
        break;
      }

      // 每个操作组中可能有 retain，insert，delete 三种操作，两个操作组转换即有 3 * 3 = 9 种组合进行转换
      // insert 操作不涉及光标位置变化，需要优先考虑
      // 以 op1 的 insert 为优先
      if (op1.type === OperatorType.Insert) {
        ot1Prime.addOp(op1);
        ot2Prime.addOp({ type: OperatorType.Retain, count: op1.data.length });
        continue;
      }
      if (op2.type === OperatorType.Insert) {
        ot1Prime.addOp({ type: OperatorType.Retain, count: op2.data.length });
        ot2Prime.addOp(op2);
        continue;
      }

      // 牵扯到 insert 的操作组合有：insert-insert，insert-retain，insert-delete 等五种
      // 接下来还有 9 - 5 = 4 种情况需要考虑
      // retain-retain 处理其中数值较小者，将较大者的剩余部分交给下一组
      if (
        op1.type === OperatorType.Retain &&
        op2.type === OperatorType.Retain
      ) {
        let min = 0;
        if (op1.count > op2.count) {
          min = op2.count;
          op1.count -= op2.count;
          op2 = { ...ops2[i2++] };
        } else if (op1.count === op2.count) {
          min = op2.count;
          op1 = { ...ops1[i1++] };
          op2 = { ...ops2[i2++] };
        } else {
          min = op1.count;
          op2.count -= op1.count;
          op1 = { ...ops1[i1++] };
        }
        ot1Prime.addOp({ type: OperatorType.Retain, count: min });
        ot2Prime.addOp({ type: OperatorType.Retain, count: min });
        continue;
      }

      // delete-delete
      if (
        op1.type === OperatorType.Delete &&
        op2.type === OperatorType.Delete
      ) {
        if (op1.count > op2.count) {
          op1.count -= op2.count;
          op2 = { ...ops2[i2++] };
        } else if (op1.count === op2.count) {
          op1 = { ...ops1[i1++] };
          op2 = { ...ops2[i2++] };
        } else {
          op2.count -= op1.count;
          op1 = { ...ops1[i1++] };
        }
        continue;
      }

      // delete-retain
      if (
        op1.type === OperatorType.Delete &&
        op2.type === OperatorType.Retain
      ) {
        let min = 0;
        if (op1.count > op2.count) {
          min = op2.count;
          op1.count -= op2.count;
          op2 = { ...ops2[i2++] };
        } else if (op1.count === op2.count) {
          min = op2.count;
          op1 = { ...ops1[i1++] };
          op2 = { ...ops2[i2++] };
        } else {
          min = op1.count;
          op2.count -= op1.count;
          op1 = { ...ops1[i1++] };
        }
        ot1Prime.addOp({ type: OperatorType.Delete, count: min });
        continue;
      }

      // retain-delete
      if (
        op1.type === OperatorType.Retain &&
        op2.type === OperatorType.Delete
      ) {
        let min = 0;
        if (op1.count > op2.count) {
          min = op2.count;
          op1.count -= op2.count;
          op2 = { ...ops2[i2++] };
        } else if (op1.count === op2.count) {
          min = op2.count;
          op1 = { ...ops1[i1++] };
          op2 = { ...ops2[i2++] };
        } else {
          min = op1.count;
          op2.count -= op1.count;
          op1 = { ...ops1[i1++] };
        }
        ot2Prime.addOp({ type: OperatorType.Delete, count: min });
        continue;
      }
    }
  }
}
