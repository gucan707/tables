import "./index.less";

import { FC, useState } from "react";
import { useParams } from "react-router-dom";

import { Input, Menu } from "@arco-design/web-react";
import { IconBranch, IconDelete, IconEdit } from "@arco-design/web-react/icon";
import { TableColumnTypes, TableHead, UndoType } from "@tables/types";

import { delColumn } from "../../http/table/delColumn";
import { putColumnType } from "../../http/table/putColumnType";
import { putHeadAttributes } from "../../http/table/putHeadAttributes";
import { setHeadAttribute } from "../../redux/headsSlice";
import { useAppDispatch } from "../../redux/store";
import { undoStack } from "../../utils/UndoStack";
import { TableIcon } from "../TableIcon";

export type HeadAttributesProps = {
  head: TableHead;
  setActiveHead: (id: string) => void;
};
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

export const HeadAttributes: FC<HeadAttributesProps> = (props) => {
  const { head, setActiveHead } = props;
  const [headName, setHeadName] = useState(head.name);
  const dispatch = useAppDispatch();
  const { tableId = "" } = useParams();

  const dropList = (
    <>
      {Object.values(TableColumnTypes).map((type, index) => (
        <MenuItem
          key={"1_" + index.toString()}
          onClick={async () => {
            if (head.type === type) return;
            const newHeadId = await putColumnType({
              headId: head._id,
              tableId,
              type,
            });
            if (!newHeadId) return;
            undoStack.add({
              type: UndoType.ColumnType,
              shouldDeleteHead: newHeadId,
              shouldRestoreHead: head._id,
            });
          }}
        >
          {type}
        </MenuItem>
      ))}
    </>
  );

  return (
    <Menu className="head_attributes" mode="pop">
      <div className="head_attributes-item">
        <IconEdit className="head_attributes-item-icon" />
        <Input
          value={headName}
          onChange={(str) => setHeadName(str)}
          onBlur={() => {
            dispatch(
              setHeadAttribute({
                ...head,
                headId: head._id,
                name: headName,
                tableId,
              })
            );
            putHeadAttributes({
              ...head,
              headId: head._id,
              name: headName,
              tableId,
            });
          }}
          className="head_attributes-item-input"
        />
      </div>
      <SubMenu
        key="1"
        title={
          <div className="head_attributes-menu_item">
            <div>
              <TableIcon type={head.type} />
              类型
            </div>
            <div className="head_attributes-menu_item-description">
              {head.type}
            </div>
          </div>
        }
      >
        {dropList}
      </SubMenu>
      <MenuItem key="2" onClick={() => setActiveHead(head._id)}>
        <IconBranch />
        属性配置
      </MenuItem>
      <MenuItem
        key="3"
        onClick={() => {
          delColumn({ headId: head._id, tableId });
          undoStack.add({
            type: UndoType.Column,
            headId: head._id,
            isDelete: false,
          });
        }}
      >
        <IconDelete />
        删除该列
      </MenuItem>
    </Menu>
  );
};
