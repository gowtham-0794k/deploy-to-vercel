import { FormattedMessage } from "react-intl";
import { IconBrandChrome } from "@tabler/icons-react";
import { NavItemType } from "types";

const icons = {
  IconBrandChrome,
};
const samplePage: NavItemType = {
  id: "sample-page",
  title: <FormattedMessage id="sample-page" />,
  icon: icons.IconBrandChrome,
  type: "group",
  url: "/sample-page",
};

export default samplePage;
