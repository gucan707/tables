import "./index.less";

import { FC, useState } from "react";
import { useParams } from "react-router-dom";

import { Input, Menu } from "@arco-design/web-react";
import { IconBranch, IconDelete, IconEdit } from "@arco-design/web-react/icon";
import { TableColumnTypes, TableHead } from "@tables/types";

import { setHeadAttribute } from "../../redux/headsSlice";
import { useAppDispatch } from "../../redux/store";
import { TableIcon } from "../TableIcon";

export type HeadAttributesProps = {
  head: TableHead;
};
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
const dropList = (
  <>
    {Object.values(TableColumnTypes).map((type, index) => (
      <MenuItem key={"1_" + index.toString()}>{type}</MenuItem>
    ))}
  </>
);

export const HeadAttributes: FC<HeadAttributesProps> = (props) => {
  const { head } = props;
  const [headName, setHeadName] = useState(head.name);
  const dispatch = useAppDispatch();
  const { tableId = "" } = useParams();

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
      <MenuItem key="2">
        <IconBranch />
        属性配置
      </MenuItem>
      <MenuItem key="3">
        <IconDelete />
        删除该列
      </MenuItem>
    </Menu>
  );
};
