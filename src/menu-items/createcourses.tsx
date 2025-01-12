import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

const Createcourse: NavItemType = {
  id: "create-courses",
  title: <FormattedMessage id="Create Courses" />,
  icon: SentimentSatisfiedAltIcon,
  type: "group",
  children: [
    {
      id: "Create-Department",
      subFeatureName: "Get Questions ",
      title: <FormattedMessage id="Create Department" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/createcourse/create-department",
    },
    {
      id: "create-decipline",
      subFeatureName: "Get Questions ",
      title: (
        <FormattedMessage
          id="Create 
      Discipline"
        />
      ),
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/createcourse/create-discipline", // Note the lowercase 'create course'
    },
    {
      id: "create-division",
      subFeatureName: "Get Questions ",
      title: <FormattedMessage id="Create Division" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/createcourse/create-division",
    },
    {
      id: "create-courses",
      subFeatureName: "Get Questions ",
      title: <FormattedMessage id="Create Courses" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/createcourse/create-course",
    },
  ],
};
export default Createcourse;
