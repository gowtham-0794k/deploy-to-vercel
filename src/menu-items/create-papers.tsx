import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

const Organization: NavItemType = {
  id: "Create-Papers",
  title: <FormattedMessage id="Create Papers" />,
  icon: SentimentSatisfiedAltIcon,
  type: "group",
  children: [
    {
      id: "Create-Papers",
      title: <FormattedMessage id="Create Papers" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/createpapers/create-papers",
    },
    {
      id: "Create-Parts",
      title: <FormattedMessage id="Create Parts" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/createpapers/create-parts",
    },
    {
      id: "Create-Chapters",
      title: <FormattedMessage id="Create Chapters" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/createpapers/create-chapters",
    },
    {
      id: "Create-Units",
      title: <FormattedMessage id="Create Units" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/createpapers/create-units",
    },
  ],
};
export default Organization;
