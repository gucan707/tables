import "./index.less";

import { type } from "os";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";

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
  MultiSelectHead,
  SelectHead,
  SelectOptionType,
  TableColumnTypes,
  TableTagColors,
} from "@tables/types";

import { postTag } from "../../http/table/postTag";
import { useAppSelector } from "../../redux/store";
import { TagsConfig } from "./components/TagsConfig";

export type HeadConfigModalProps = {
  activeHead: string;
  setActiveHead: (s: string) => void;
};
const Option = Select.Option;
export const HeadConfigModal: FC<HeadConfigModalProps> = (props) => {
  const { activeHead, setActiveHead } = props;
  const heads = useAppSelector((state) => state.headsReducer.heads);
  const curHead = heads.find((head) => head._id === activeHead);

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
      content = <TagsConfig curHead={curHead} />;
      break;
    default:
      content = <>当前类型无额外配置项</>;
      break;
  }

  return (
    <Modal
      title="属性配置"
      visible
      onOk={() => setActiveHead("")}
      onCancel={() => setActiveHead("")}
      autoFocus={false}
      focusLock={true}
    >
      {content}
    </Modal>
  );
};
