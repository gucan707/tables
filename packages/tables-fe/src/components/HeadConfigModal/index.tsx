import "./index.less";

import { FC } from "react";

import { Modal } from "@arco-design/web-react";
import { TableColumnTypes } from "@tables/types";

import { useAppSelector } from "../../redux/store";
import { DateConfig } from "./components/DateConfig";
import { TagsConfig } from "./components/TagsConfig";

export type HeadConfigModalProps = {
  activeHead: string;
  setActiveHead: (s: string) => void;
};

export const HeadConfigModal: FC<HeadConfigModalProps> = (props) => {
  const { activeHead, setActiveHead } = props;
  const heads = useAppSelector((state) => state.headsReducer.heads);
  const curHead = heads.find((head) => head._id === activeHead);
  const closeModal = () => setActiveHead("");

  if (!curHead) return null;

  let content: JSX.Element;
  switch (curHead.type) {
    case TableColumnTypes.Date:
      content = <DateConfig curHead={curHead} closeModal={closeModal} />;
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
      onCancel={closeModal}
      autoFocus={false}
      focusLock
      footer={null}
    >
      {content}
    </Modal>
  );
};
