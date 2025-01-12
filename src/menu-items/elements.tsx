import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";
import { IconBrush, IconTools } from "@tabler/icons-react";

// constant
const icons = {
  IconBrush,
  IconTools,
};

const elements: NavItemType = {
  id: "Dashboard",
  title: <FormattedMessage id="Dashboard" />,
  icon: icons.IconBrush,
  type: "group",
  featureName: "Dashboard",
  children: [
    {
      id: "Select-Course",
      subFeatureName: "Select Course",
      title: <FormattedMessage id="Select Course" />,
      type: "collapse",
      icon: icons.IconBrush,
      children: [
        {
          id: "CA",
          title: <FormattedMessage id="CA" />,
          type: "item",
          url: "/ui-element/basic/list",
          breadcrumbs: false,
        },
        {
          id: "CS",
          title: <FormattedMessage id="CS" />,
          type: "item",
          url: "/ui-element/basic/tabs",
          breadcrumbs: false,
        },
      ],
    },
    {
      id: "Select Paper",
      subFeatureName: "Select Paper",
      title: <FormattedMessage id="Select Paper" />,
      type: "collapse",
      icon: icons.IconTools,
      children: [
        {
          id: "paper 1",
          title: <FormattedMessage id="Paper 1" />,
          type: "item",
          url: "/ui-element/advance/timeline",
          breadcrumbs: false,
        },
        {
          id: "Paper 2",
          title: <FormattedMessage id="Paper 2" />,
          type: "item",
          url: "/ui-element/advance/toggle-button",
          breadcrumbs: false,
        },
        {
          id: "Paper 3",
          title: <FormattedMessage id="Paper 3" />,
          type: "item",
          url: "/ui-element/advance/treeview",
          breadcrumbs: false,
        },
      ],
    },
  ],
};

export default elements;
