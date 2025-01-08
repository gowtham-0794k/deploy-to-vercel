import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfiedAlt";

const Organization: NavItemType = {
  id: "sales-packages",
  title: <FormattedMessage id="Sales Packages" />,
  icon: SentimentSatisfiedIcon,
  type: "group",
  children: [
    {
      id: "Create-Sales-Packages",
      title: <FormattedMessage id="Create Sales Packages" />,
      type: "item",
      icon: SentimentSatisfiedIcon,
      url: "/salespackages/create-sales-packages",
    },
    {
      id: "View-Modify-Sales-Packages",
      title: <FormattedMessage id="View Modify Sales Packages" />,
      type: "item",
      icon: SentimentSatisfiedIcon,
      url: "/salespackages/view-modify-sales-packages",
    },
    {
      id: "upgrade-suggestions",
      title: <FormattedMessage id="Upgrade Suggestions" />,
      type: "item",
      icon: SentimentSatisfiedIcon,
      url: "/salespackages/upgrade-suggestions",
    },
  ],
};
export default Organization;
