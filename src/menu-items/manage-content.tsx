import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";

const Organization: NavItemType = {
  id: "Manage-content",
  featureName: "Manage Content",
  title: <FormattedMessage id="Manage Content" />,
  icon: "/assets/logos/ASK Type 2.svg",
  type: "group",
  children: [
    {
      id: "Manage-ask-questions",
      subFeatureName: "Manage Ask Questions",
      title: <FormattedMessage id="Manage Ask Questions" />,
      type: "item",
      icon: "/assets/logos/ASK Type 3.svg",
      url: "/managecontent/manage-ask-questions",
    },
    {
      id: "Manage-get-questions",
      subFeatureName: "Manage Get Questions",
      title: <FormattedMessage id="Manage Get Questions" />,
      type: "item",
      icon: "/assets/logos/ASK Type 3.svg",
      url: "/managecontent/manage-get-questions",
    },
    {
      id: "Manage Rise Files",
      subFeatureName: "Manage Rise Files",
      title: <FormattedMessage id="Manage Rise Files" />,
      type: "item",
      icon: "/assets/logos/ASK Type 3.svg",
      url: "/managecontent/manage-rise-files",
    },
  ],
};
export default Organization;
