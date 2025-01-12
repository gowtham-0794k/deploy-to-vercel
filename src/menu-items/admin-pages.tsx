import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";

const Organization: NavItemType = {
  id: "Admin-pages",
  featureName: "Admin pages",
  title: <FormattedMessage id="Admin Pages" />,
  icon: "/assets/logos/ASK Type 1.svg",
  type: "group",
  children: [
    {
      id: "pricing-page",
      subFeatureName: "",
      title: <FormattedMessage id="Pricing Page" />,
      type: "item",
      icon: "/assets/logos/ASK Type 1.svg",
      url: "/adminpages/pricing-page",
    },
    {
      id: "checkout-page",
      subFeatureName: "",
      title: <FormattedMessage id="Checkout Page" />,
      type: "item",
      icon: "/assets/logos/ASK Type 1.svg",
      url: "/adminpages/checkout-page",
    },
  ],
};
export default Organization;
