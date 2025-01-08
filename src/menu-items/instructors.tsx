import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfiedAlt";

const Organization: NavItemType = {
  id: "Instructors",
  title: <FormattedMessage id="Instructors" />,
  icon: SentimentSatisfiedIcon,
  type: "group",
  children: [
    {
      id: "Institute-exam-evaluation-creator",
      title: <FormattedMessage id="Institute Exam Evaluation Creator" />,
      type: "item",
      icon: SentimentSatisfiedIcon,
      url: "/pages/organisation-content/Institute-exam-evaluation-creator",
    },
    {
      id: "Institute-exam-evaluation-user",
      title: <FormattedMessage id="Institute Exam Evaluation User" />,
      type: "item",
      icon: SentimentSatisfiedIcon,
      url: "/pages/organisation-content/Institute-exam-evaluation-user",
    },
  ],
};
export default Organization;
