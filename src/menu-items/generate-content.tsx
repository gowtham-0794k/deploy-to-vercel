import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

const Organization: NavItemType = {
  id: "Generate-content",
  title: <FormattedMessage id="Generate Content" />,
  icon: SentimentSatisfiedAltIcon,
  type: "group",
  children: [
    {
      id: "Podcast maker",
      title: <FormattedMessage id="Podcast maker" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/pages/Generate-content/Podcast-maker",
    },
    {
      id: "Finetuning-content-maker",
      title: <FormattedMessage id="Finetuning content maker" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/pages/Generate-content/Finetuning-content-maker",
    },
  ],
};
export default Organization;
