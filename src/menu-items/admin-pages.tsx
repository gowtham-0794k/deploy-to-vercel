import { FormattedMessage } from "react-intl";
import { IconKey, IconBug } from "@tabler/icons-react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { NavItemType } from "types";
const icons = {
  IconKey,
  IconBug,
};

const Organization: NavItemType = {
  id: "Admin-pages",
  title: <FormattedMessage id="Admin Pages" />,
  icon: icons.IconKey,
  type: "group",
  children: [
    {
      id: "pricing-page",
      title: <FormattedMessage id="Pricing Page" />,
      type: "item",
      icon: MenuBookIcon,
      url: "/adminpages/pricing-page",
    },
    {
      id: "checkout-page",
      title: <FormattedMessage id="Checkout Page" />,
      type: "item",
      icon: MenuBookIcon,
      url: "/adminpages/checkout-page",
    },
  ],
};
export default Organization;
