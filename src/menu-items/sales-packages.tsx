import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";


const Organization: NavItemType = {
  id: "sales-packages",
  featureName: "Sales Packages",
  title: <FormattedMessage id="Sales Packages" />,
  icon: "/assets/logos/ASK Type 2.svg",
  type: "group",
  children: [
    {
      id: "Create-Sales-Packages",
      subFeatureName: "",
      title: <FormattedMessage id="Create Sales Packages" />,
      type: "item",
      icon: "/assets/logos/ASK Type 2.svg",
      url: "/salespackages/create-sales-packages",
    },
    {
      id: "View-Modify-Sales-Packages",
      subFeatureName: "",
      title: <FormattedMessage id="View Modify Sales Packages" />,
      type: "item",
      icon: "/assets/logos/ASK Type 2.svg",
      url: "/salespackages/view-modify-sales-packages",
    },
    {
      id: "upgrade-suggestions",
      subFeatureName: "Create Upgrade packs",
      title: <FormattedMessage id="Upgrade Suggestions" />,
      type: "item",
      icon: "/assets/logos/ASK Type 2.svg",
      url: "/salespackages/upgrade-suggestions",
    },
  ],
};
export default Organization;
