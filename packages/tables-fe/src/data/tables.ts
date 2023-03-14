import {
  DateFormatOptions,
  NumberFormatDecimal,
  NumberFormatPercent,
  SelectOptionType,
  Table,
  TableColumnTypes,
  TableTagColors,
} from "@tables/types";

export const fakeTables: Table[] = [
  {
    title: "test",
    owner: "640c3c26a72793f4e8e76567",
    _id: "640c4048a72793f4e8e76568",
    collaborators: [],
    heads: [
      {
        _id: "640c4048a72793f4e8e76569",
        name: "文本",
        type: TableColumnTypes.Text,
      },
      {
        _id: "640c4048a72793f4e8e7656a",
        name: "复选框",
        type: TableColumnTypes.Checkbox,
      },
      {
        _id: "640c4048a72793f4e8e7656b",
        name: "单选",
        type: TableColumnTypes.Select,
      },
      {
        _id: "640c4048a72793f4e8e7656c",
        name: "多选",
        type: TableColumnTypes.MultiSelect,
      },
      {
        _id: "640c4048a72793f4e8e7656d",
        name: "日期",
        type: TableColumnTypes.Date,
      },
      {
        _id: "640c4048a72793f4e8e7656e",
        name: "数字",
        type: TableColumnTypes.Number,
      },
    ],
    body: [
      {
        _id: "1",
        tableId: "640c4048a72793f4e8e76568",
        data: [
          {
            type: TableColumnTypes.Checkbox,
            _id: "2",
            checked: true,
            headId: "640c4048a72793f4e8e7656a",
            version: 1,
          },
          {
            type: TableColumnTypes.Date,
            _id: "4",
            date: 1678610596662,
            format: DateFormatOptions.YMDT,
            headId: "640c4048a72793f4e8e7656d",
            version: 1,
          },
          {
            type: TableColumnTypes.Number,
            _id: "5",
            content: 123,
            decimal: NumberFormatDecimal.None,
            percent: NumberFormatPercent.None,
            headId: "640c4048a72793f4e8e7656e",
            version: 1,
          },
          {
            type: TableColumnTypes.Text,
            _id: "5",
            text: "哈哈哈哈哈哈哈哈哈",
            headId: "640c4048a72793f4e8e76569",
            version: 1,
          },
          {
            type: TableColumnTypes.Select,
            _id: "9",
            content: "tag1",
            headId: "640c4048a72793f4e8e7656b",
            version: 1,
          },
          {
            type: TableColumnTypes.MultiSelect,
            _id: "9",
            contents: ["tag2", "tag3", "tag4", "tag5", "tag6", "tag7"],
            headId: "640c4048a72793f4e8e7656c",
            version: 1,
          },
        ],
      },
    ],
  },
];

export const fakeTags: SelectOptionType[] = [
  {
    _id: "tag1",
    headId: "640c4048a72793f4e8e7656b",
    text: "test",
    color: TableTagColors.Blue,
  },
  {
    _id: "tag2",
    headId: "640c4048a72793f4e8e7656c",
    text: "test",
    color: TableTagColors.Cyan,
  },
  {
    _id: "tag3",
    headId: "640c4048a72793f4e8e7656c",
    text: "test",
    color: TableTagColors.Orange,
  },
  {
    _id: "tag4",
    headId: "640c4048a72793f4e8e7656c",
    text: "test",
    color: TableTagColors.Gray,
  },
  {
    _id: "tag5",
    headId: "640c4048a72793f4e8e7656c",
    text: "test",
    color: TableTagColors.Purple,
  },
  {
    _id: "tag6",
    headId: "640c4048a72793f4e8e7656c",
    text: "test",
    color: TableTagColors.Red,
  },
  {
    _id: "tag7",
    headId: "640c4048a72793f4e8e7656c",
    text: "test",
    color: TableTagColors.Yellow,
  },
];
