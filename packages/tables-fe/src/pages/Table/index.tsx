import "./index.less";

import { FC, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { Avatar, Button, Spin } from "@arco-design/web-react";
import { Events, OpsEmitedFromBeArgs, UserToken } from "@tables/types";

import { EditableTable } from "../../components/EditableTable";
import { useTableDetail } from "../../http/table/useTableDetail";
import { addRows } from "../../redux/rowsSlice";
import { useAppDispatch } from "../../redux/store";
import { setup, socket } from "../../socket";
import { addColumnFn } from "../../socket/addColumnFn";
import { addRowFn } from "../../socket/addRowFn";
import { addTagFn } from "../../socket/addTagFn";
import { changeHeadTypeFn } from "../../socket/changeHeadTypeFn";
import { delColumnFn } from "../../socket/delColumnFn";
import { delRowFn } from "../../socket/delRow";
import { opsEmitedFromBeFn } from "../../socket/opsEmitedFromBeFn";
import { putHeadAttributeFn } from "../../socket/putHeadAttributeFn";
import { replaceGridContentFn } from "../../socket/replaceGridContentFn";
import { updateTagFn } from "../../socket/updateTagFn";
import { OTController } from "../../utils/OTsController";
import { TagsOTController } from "../../utils/tagsOTController";
import { undoStack } from "../../utils/UndoStack";

const AvatarGroup = Avatar.Group;

export const Table: FC = () => {
  const { tableId } = useParams();

  const { tableDetail } = useTableDetail({
    tableId: tableId || "",
  });
  const [onlineUsers, setOnlineUsers] = useState<UserToken[]>([]);
  const dispatch = useAppDispatch();
  const shortcutInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!tableId) return;
    undoStack.init();
    OTController.current = new OTController();
    TagsOTController.current = new TagsOTController();
    setup(tableId);
    socket.on(Events.EmitOnlineUsers, (users: UserToken[]) => {
      setOnlineUsers(users);
    });
  }, [tableId]);

  useEffect(() => {
    socket.on(Events.OpsEmitedFromBe, opsEmitedFromBeFn);
    socket.on(Events.ReplaceGridContent, replaceGridContentFn);
    socket.on(Events.PutHeadAttributes, putHeadAttributeFn);
    socket.on(Events.AddTag, addTagFn);
    socket.on(Events.UpdateTag, updateTagFn);
    socket.on(Events.AddColumn, addColumnFn);
    socket.on(Events.DelColumn, delColumnFn);
    socket.on(Events.ChangeHeadType, changeHeadTypeFn);
    socket.on(Events.AddRow, addRowFn);
    socket.on(Events.DelRow, delRowFn);

    return () => {
      socket.off(Events.OpsEmitedFromBe, opsEmitedFromBeFn);
      socket.off(Events.ReplaceGridContent, replaceGridContentFn);
      socket.off(Events.PutHeadAttributes, putHeadAttributeFn);
      socket.off(Events.AddTag, addTagFn);
      socket.off(Events.UpdateTag, updateTagFn);
      socket.off(Events.AddColumn, addColumnFn);
      socket.off(Events.DelColumn, delColumnFn);
      socket.off(Events.ChangeHeadType, changeHeadTypeFn);
      socket.off(Events.AddRow, addRowFn);
      socket.off(Events.DelRow, delRowFn);
    };
  }, [tableDetail, socket]);

  useEffect(() => {
    if (!tableDetail) return;
    dispatch(addRows(tableDetail.rows));
  }, [tableDetail]);

  useEffect(() => {
    if (!shortcutInputRef || !shortcutInputRef.current) return;
    if (!document.activeElement || document.activeElement === document.body) {
      shortcutInputRef.current.focus();
    }
    const handleMouseDown = (event: MouseEvent) => {
      // 检查点击的元素是否为输入框
      if ((event.target as HTMLElement)?.tagName !== "INPUT") {
        // 如果不是输入框，则聚焦隐藏的输入框
        event.preventDefault();
        shortcutInputRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [shortcutInputRef]);

  return (
    <div className="table">
      <header className="table-header">
        <Button type="outline">管理协作者</Button>
        <AvatarGroup size={32} style={{ margin: 10 }}>
          {onlineUsers.map((user) => (
            <Avatar key={user._id} style={{ backgroundColor: "#7BC616" }}>
              {user.name.slice(0, 1)}
            </Avatar>
          ))}
        </AvatarGroup>
        <Avatar>A</Avatar>
      </header>
      <div className="table-content">
        <div className="table-content-title">学习计划</div>
        {tableDetail ? <EditableTable table={tableDetail} /> : <Spin />}
      </div>
      <input
        className="hidden"
        type="text"
        ref={shortcutInputRef}
        readOnly
        onKeyDown={(e) => console.log(e)}
      />
    </div>
  );
};
