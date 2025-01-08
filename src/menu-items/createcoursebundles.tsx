import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfiedAlt";

const Organization: NavItemType = {
  id: "Create-course-bundles",
  title: <FormattedMessage id="Create Course Bundles" />,
  icon: SentimentSatisfiedIcon,
  type: "group",
  children: [
    {
      id: "Create Group",
      title: <FormattedMessage id="Create Group" />,
      type: "item",
      icon: SentimentSatisfiedIcon,
      url: "/createcoursebundles/create-group",
    },
    {
      id: "Create Bundles",
      title: <FormattedMessage id="Create Bundles" />,
      type: "item",
      icon: SentimentSatisfiedIcon,
      url: "/createcoursebundles/create-bundles",
    },
    {
      id: "manage-bundle",
      title: <FormattedMessage id="Manage Bundles" />,
      type: "item",
      icon: SentimentSatisfiedIcon,
      url: "/createcoursebundles/manage-bundles",
    },
  ],
};
export default Organization;
