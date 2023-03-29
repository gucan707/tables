import "./index.less";

import { FC, useState } from "react";

import {
  Button,
  Input,
  Modal,
  Select,
  Tag,
  Trigger,
} from "@arco-design/web-react";
import {
  DateFormatOptions,
  TableColumnTypes,
  TableTagColors,
} from "@tables/types";

import { useAppSelector } from "../../redux/store";

export type HeadConfigModalProps = {
  activeHead: string;
  setActiveHead: (s: string) => void;
};
const Option = Select.Option;
export const HeadConfigModal: FC<HeadConfigModalProps> = (props) => {
  const { activeHead, setActiveHead } = props;
  const heads = useAppSelector((state) => state.headsReducer.heads);
  const curHead = heads.find((head) => head._id === activeHead);
  const [newTagColor, setNewTagColor] = useState(TableTagColors.Yellow);

  if (!curHead) return null;

  let content: JSX.Element;
  switch (curHead.type) {
    case TableColumnTypes.Date:
      content = (
        <div className="head_config-date">
          请选择日期格式
          <Select
            className="head_config-date-select"
            placeholder="Please select"
            style={{ width: 154 }}
          >
            {Object.values(DateFormatOptions).map((option, index) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </div>
      );
      break;
    case TableColumnTypes.Select:
      const colors = (
        <div className="head_config-select-add-all_colors">
          {Object.values(TableTagColors).map((color) => (
            <Tag
              className="head_config-select-add-all_colors-tag"
              color={color}
              onClick={() => {
                setNewTagColor(color);
              }}
            >
              {color}
            </Tag>
          ))}
        </div>
      );
      content = (
        <div className="head_config-select">
          <div className="head_config-select-add">
            新增标签
            <Input className="head_config-select-add-input" />
            <Trigger
              popup={() => colors}
              trigger="click"
              position="bottom"
              classNames="zoomInTop"
            >
              <Tag color={newTagColor} className="head_config-select-add-color">
                color
              </Tag>
            </Trigger>
            <Button type="text">新增</Button>
          </div>
          <div>
            当前标签：
            {curHead.tags.length
              ? curHead.tags.map(() => <Tag>1</Tag>)
              : "暂无标签"}
          </div>
        </div>
      );
      break;
    default:
      content = <>当前类型无额外配置项</>;
      break;
  }

  return (
    <Modal
      title="Modal Title"
      visible={true}
      onOk={() => setActiveHead("")}
      onCancel={() => setActiveHead("")}
      autoFocus={false}
      focusLock={true}
    >
      {content}
    </Modal>
  );
};
