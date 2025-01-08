import { FormattedMessage } from "react-intl";
import { IconBrandChrome } from "@tabler/icons-react";
import { NavItemType } from "types";

const icons = {
  IconBrandChrome,
};

const SelectCourse: NavItemType = {
  id: "select-course",
  title: <FormattedMessage id="select-course" />,
  icon: icons.IconBrandChrome,
  type: "group",
  url: "/select-course",
  children: [
    {
      id: "course-1",
      title: <FormattedMessage id="Course 1" />,
      type: "item",
      url: "/select-course1",
      children: [
        {
          id: "course-1a",
          title: <FormattedMessage id="Course 1A" />,
          type: "item",
          url: "/select-course1/a",
        },
        {
          id: "course-1b",
          title: <FormattedMessage id="Course 1B" />,
          type: "item",
          url: "/select-course1/b",
        },
        {
          id: "course-1c",
          title: <FormattedMessage id="Course 1C" />,
          type: "item",
          url: "/select-course1/c",
        },
      ],
    },
    {
      id: "course-2",
      title: <FormattedMessage id="Course 2" />,
      type: "item",
      url: "/select-course2",
      children: [
        {
          id: "course-2a",
          title: <FormattedMessage id="Course 2A" />,
          type: "item",
          url: "/select-course2/a",
        },
        {
          id: "course-2b",
          title: <FormattedMessage id="Course 2B" />,
          type: "item",
          url: "/select-course2/b",
        },
        {
          id: "course-2c",
          title: <FormattedMessage id="Course 2C" />,
          type: "item",
          url: "/select-course2/c",
        },
      ],
    },
  ],
};
export default SelectCourse;
