import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfiedAlt";

const pages: NavItemType = {
  id: "Learning",
  title: <FormattedMessage id="Learning" />,
  icon: SentimentSatisfiedIcon,
  type: "group",
  children: [
    {
      id: "Ask-Questions",
      title: <FormattedMessage id="Ask Questions" />,
      type: "item",
      icon: SentimentSatisfiedIcon,
      url: "learning/ask-questions",
      breadcrumbs: true,
    },
    {
      id: "Get-Questions",
      title: <FormattedMessage id="Get Questions" />,
      type: "item",
      icon: SentimentSatisfiedIcon,
      url: "learning/get-questions",
      breadcrumbs: true,
    },
  ],
};
export default pages;
