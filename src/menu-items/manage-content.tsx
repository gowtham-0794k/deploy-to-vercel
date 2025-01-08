import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

const Organization: NavItemType = {
  id: "Manage-content",
  title: <FormattedMessage id="Manage Content" />,
  icon: SentimentSatisfiedAltIcon,
  type: "group",
  children: [
    {
      id: "Manage-ask-questions",
      title: <FormattedMessage id="Manage Ask Questions" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/managecontent/manage-ask-questions",
    },
    {
      id: "Manage-get-questions",
      title: <FormattedMessage id="Manage Get Questions" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/managecontent/manage-get-questions",
    },
    {
      id: "Manage Rise Files",
      title: <FormattedMessage id="Manage Rise Files" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/managecontent/manage-rise-files",
    },
  ],
};
export default Organization;
