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
      title: <FormattedMessage id="Create Department" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/createcourse/create-department",
    },
    {
      id: "create-decipline",
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
      id: "create-devision",
      title: <FormattedMessage id="Create Division" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/createcourse/create-devision",
    },
    {
      id: "create-courses",
      title: <FormattedMessage id="Create Courses" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/createcourse/create-course",
    },
  ],
};
export default Createcourse;
