import "./index.less";

import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Avatar, Button, Spin } from "@arco-design/web-react";
import { Events, OpsEmitedFromBeArgs, UserToken } from "@tables/types";

import { EditableTable } from "../../components/EditableTable";
import { useTableDetail } from "../../http/table/useTableDetail";
import { setup, socket } from "../../socket";
import { addTagFn } from "../../socket/addTagFn";
import { opsEmitedFromBeFn } from "../../socket/opsEmitedFromBeFn";
import { putHeadAttributeFn } from "../../socket/putHeadAttributeFn";
import { replaceGridContentFn } from "../../socket/replaceGridContentFn";
import { updateTagFn } from "../../socket/updateTagFn";
import { OTController } from "../../utils/OTsController";
import { TagsOTController } from "../../utils/tagsOTController";

const AvatarGroup = Avatar.Group;

export const Table: FC = () => {
  const { tableId } = useParams();
  const { tableDetail, tableDetailCopyRef } = useTableDetail({
    tableId: tableId || "",
  });
  const [onlineUsers, setOnlineUsers] = useState<UserToken[]>([]);

  useEffect(() => {
    if (!tableId) return;
    OTController.current = new OTController();
    TagsOTController.current = new TagsOTController();
    setup(tableId);
    socket.on(Events.EmitOnlineUsers, (users: UserToken[]) => {
      setOnlineUsers(users);
    });
  }, [tableId]);

  useEffect(() => {
    const opsEmitedFromBeTempFn = (args: OpsEmitedFromBeArgs<string>) =>
      opsEmitedFromBeFn(args, tableDetailCopyRef);

    socket.on(Events.OpsEmitedFromBe, opsEmitedFromBeTempFn);
    socket.on(Events.ReplaceGridContent, replaceGridContentFn);
    socket.on(Events.PutHeadAttributes, putHeadAttributeFn);
    socket.on(Events.AddTag, addTagFn);
    socket.on(Events.UpdateTag, updateTagFn);

    return () => {
      socket.off(Events.OpsEmitedFromBe, opsEmitedFromBeTempFn);
      socket.off(Events.ReplaceGridContent, replaceGridContentFn);
      socket.off(Events.PutHeadAttributes, putHeadAttributeFn);
      socket.off(Events.AddTag, addTagFn);
      socket.off(Events.UpdateTag, updateTagFn);
    };
  }, [tableDetail, socket]);

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
    </div>
  );
};
