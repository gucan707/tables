import "./index.less";

import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Avatar, Button, Spin } from "@arco-design/web-react";
import { Events, User, UserToken } from "@tables/types";

import { EditableTable } from "../../components/EditableTable";
import { useTableDetail } from "../../http/table/useTableDetail";
import { setup, socket } from "../../socket";

const AvatarGroup = Avatar.Group;

export const Table: FC = () => {
  const { tableId } = useParams();
  const { tableDetail } = useTableDetail({ tableId: tableId || "" });
  const [onlineUsers, setOnlineUsers] = useState<UserToken[]>([]);
  console.log({ onlineUsers });

  useEffect(() => {
    if (!tableId) return;
    console.log({ tableId });

    setup(tableId);
    // TODO 从后端获取在线用户列表
    socket.on(Events.JoinRoom, (userInfo: UserToken) => {
      setOnlineUsers((oldUsers) => [...oldUsers, userInfo]);
    });
  }, [tableId]);

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
