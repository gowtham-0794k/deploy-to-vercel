import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";


const Organization: NavItemType = {
  id: "Create-course-bundles",
  featureName: "Create Course Bundles",
  title: <FormattedMessage id="Create Course Bundles" />,
  icon: "/assets/logos/ASK Type 1.svg",
  type: "group",
  children: [
    {
      id: "Create Group",
      subFeatureName: "",
      title: <FormattedMessage id="Create Group" />,
      type: "item",
      icon: "/assets/logos/ASK Type 1.svg",
      url: "/createcoursebundles/create-group",
    },
    {
      id: "Create Bundles",
      subFeatureName: "Create Bundle",
      title: <FormattedMessage id="Create Bundles" />,
      type: "item",
      icon: "/assets/logos/ASK Type 1.svg",
      url: "/createcoursebundles/create-bundles",
    },
    {
      id: "manage-bundle",
      subFeatureName: "",
      title: <FormattedMessage id="Manage Bundles" />,
      type: "item",
      icon: "/assets/logos/ASK Type 1.svg",
      url: "/createcoursebundles/manage-bundles",
    },
  ],
};
export default Organization;
