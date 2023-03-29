import "./index.less";

import { FC, useState } from "react";
import { useParams } from "react-router-dom";

import { Button, Input, Tag, Trigger } from "@arco-design/web-react";
import {
  MultiSelectHead,
  SelectHead,
  SelectOptionType,
  TableTagColors,
} from "@tables/types";

import { postTag } from "../../../../http/table/postTag";
import { putTag } from "../../../../http/table/putTag";

type TagsConfigProps = {
  curHead: SelectHead | MultiSelectHead;
};

export const TagsConfig: FC<TagsConfigProps> = (props) => {
  const { curHead } = props;
  const [newTagColor, setNewTagColor] = useState(TableTagColors.Yellow);
  const [tagText, setTagText] = useState("");
  const [curUpdatingTag, setCurUpdatingTag] = useState<
    SelectOptionType | undefined
  >();
  const { tableId = "" } = useParams();

  return (
    <div className="tags_config-select">
      <div className="tags_config-select-add">
        新增标签
        <Input
          value={tagText}
          onChange={(str) => {
            setTagText(str);
          }}
          className="tags_config-select-add-input"
        />
        <Trigger
          popup={() => <TagsColors onTagClick={setNewTagColor} />}
          trigger="click"
          position="bottom"
          classNames="zoomInTop"
        >
          <Tag color={newTagColor} className="tags_config-select-add-color">
            color
          </Tag>
        </Trigger>
        <Button
          type="text"
          onClick={() => {
            postTag({
              color: newTagColor,
              headId: curHead._id,
              text: tagText,
              tableId,
            });
          }}
        >
          新增
        </Button>
      </div>
      <div>
        当前标签：
        <div className="tags_config-select-tags">
          {curHead.tags.length
            ? curHead.tags.map((tag) => (
                <Tag
                  bordered={curUpdatingTag?._id === tag._id}
                  key={tag._id}
                  color={tag.color}
                  closable
                  onClick={() => {
                    setCurUpdatingTag(tag);
                  }}
                >
                  {tag.text}
                </Tag>
              ))
            : "暂无标签"}
        </div>
      </div>
      {curUpdatingTag && (
        <div className="tags_config-select-add">
          修改标签
          <Input
            value={curUpdatingTag.text}
            onChange={(str) => {
              setCurUpdatingTag({ ...curUpdatingTag, text: str });
            }}
            className="tags_config-select-add-input"
          />
          <Trigger
            popup={() => (
              <TagsColors
                onTagClick={(color) => {
                  setCurUpdatingTag({ ...curUpdatingTag, color });
                }}
              />
            )}
            trigger="click"
            position="bottom"
            classNames="zoomInTop"
          >
            <Tag
              color={curUpdatingTag.color}
              className="tags_config-select-add-color"
            >
              color
            </Tag>
          </Trigger>
          <Button
            type="text"
            onClick={async () => {
              await putTag({
                color: curUpdatingTag.color,
                headId: curHead._id,
                tableId,
                tagId: curUpdatingTag._id,
                text: curUpdatingTag.text,
              });
              setCurUpdatingTag(undefined);
            }}
          >
            修改
          </Button>
          <Button
            type="text"
            onClick={() => {
              setCurUpdatingTag(undefined);
            }}
          >
            放弃
          </Button>
        </div>
      )}
    </div>
  );
};

type TagsColors = {
  onTagClick: (color: TableTagColors) => void;
};

export const TagsColors: FC<TagsColors> = (props) => {
  const { onTagClick } = props;

  return (
    <div className="tags_config-select-add-all_colors">
      {Object.values(TableTagColors).map((color) => (
        <Tag
          key={color}
          className="tags_config-select-add-all_colors-tag"
          color={color}
          onClick={() => {
            onTagClick(color);
          }}
        >
          {color}
        </Tag>
      ))}
    </div>
  );
};
