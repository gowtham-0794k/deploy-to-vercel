import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";


const Organization: NavItemType = {
  id: "Create-Papers",
  featureName: "Create Papers",
  title: <FormattedMessage id="Create Papers" />,
  icon: "/assets/logos/ASK Type 1.svg",
  type: "group",
  children: [
    {
      id: "Create-Papers",
      subFeatureName: "Create Papers",
      title: <FormattedMessage id="Create Papers" />,
      type: "item",
      icon: "/assets/logos/ASK Type 1.svg",
      url: "/createpapers/create-papers",
    },
    {
      id: "Create-Parts",
      subFeatureName: "Create Parts",
      title: <FormattedMessage id="Create Parts" />,
      type: "item",
      icon: "/assets/logos/ASK Type 1.svg",
      url: "/createpapers/create-parts",
    },
    {
      id: "Create-Chapters",
      subFeatureName: "Create Chapters",
      title: <FormattedMessage id="Create Chapters" />,
      type: "item",
      icon: "/assets/logos/ASK Type 1.svg",
      url: "/createpapers/create-chapters",
    },
    {
      id: "Create-Units",
      subFeatureName: "Create Units",
      title: <FormattedMessage id="Create Units" />,
      type: "item",
      icon: "/assets/logos/ASK Type 1.svg",
      url: "/createpapers/create-units",
    },
  ],
};
export default Organization;
