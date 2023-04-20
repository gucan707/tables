import { Message } from "@arco-design/web-react";
import { UndoStackData } from "@tables/types";

import { undo } from "../http/table/undo";

export class UndoStack {
  private undo: UndoStackData[] = [];
  private tableId: string = "";

  init(tableId: string) {
    this.undo = [];
    this.tableId = tableId;
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
    undo({ ...latestUndo, tableId: this.tableId });
  }
}

export const undoStack = new UndoStack();
