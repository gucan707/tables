import { FC, ReactElement } from "react";

import {
  IconCalendar,
  IconCheckSquare,
  IconDownCircle,
  IconFontColors,
  IconFormula,
  IconUnorderedList,
} from "@arco-design/web-react/icon";
import { TableColumnTypes } from "@tables/types";

export type TableIconProps = {
  type: TableColumnTypes;
  iconClassName?: string;
  className?: string;
  onClick?: () => void;
};

export const TableIcon: FC<TableIconProps> = (props) => {
  const { type, iconClassName = "", className = "", onClick } = props;
  let icon;
  switch (type) {
    case TableColumnTypes.Text:
      icon = <IconFontColors className={iconClassName} />;
      break;
    case TableColumnTypes.Checkbox:
      icon = <IconCheckSquare className={iconClassName} />;
      break;
    case TableColumnTypes.Date:
      icon = <IconCalendar className={iconClassName} />;
      break;
    case TableColumnTypes.MultiSelect:
      icon = <IconUnorderedList className={iconClassName} />;
      break;
    case TableColumnTypes.Number:
      icon = <IconFormula className={iconClassName} />;
      break;
    case TableColumnTypes.Select:
      icon = <IconDownCircle className={iconClassName} />;
      break;
    default:
      break;
  }

  return (
    <div className={className} onClick={onClick}>
      {icon}
    </div>
  );
};
