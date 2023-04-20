import { Message } from "@arco-design/web-react";
import { UndoStackData } from "@tables/types";

export class UndoStack {
  private undo: UndoStackData[] = [];

  init() {
    this.undo = [];
  }

  add(data: UndoStackData) {
    this.undo.push(data);
  }

  pop() {
    const latestUndo = this.undo.pop();
    if (!latestUndo) {
      Message.warning("无可撤销操作");
      return;
    }
    console.log({ latestUndo });
  }
}

export const undoStack = new UndoStack();
