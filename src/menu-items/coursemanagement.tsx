import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";


const Createcourse: NavItemType = {
  id: "Course-Management",
  featureName: "Course Management",
  title: <FormattedMessage id="Course Management" />,
  icon: "/assets/logos/ASK Type 2.svg",
  type: "group",
  children: [
    {
      id: "Create-Department",
      subFeatureName: "Create Department",
      title: <FormattedMessage id="Create Department" />,
      type: "item",
      icon: "/assets/logos/ASK Type 2.svg",
      url: "/coursemanagement/create-department",
    },
    {
      id: "create-decipline",
      subFeatureName: "Create Discipline",
      title: (
        <FormattedMessage
          id="Create 
      Discipline"
        />
      ),
      type: "item",
      icon: "/assets/logos/ASK Type 1.svg",
      url: "/coursemanagement/create-discipline", // Note the lowercase 'create course'
    },
    {
      id: "create-division",
      subFeatureName: "Create Division",
      title: <FormattedMessage id="Create Division" />,
      type: "item",
      icon: "/assets/logos/ASK Type 1.svg",
      url: "/coursemanagement/create-division",
    },
    {
      id: "create-courses",
      subFeatureName: "Create Course1",
      title: <FormattedMessage id="Create Courses" />,
      type: "item",
      icon: "/assets/logos/ASK Type 1.svg",
      url: "/coursemanagement/create-course",
    },
  ],
};
export default Createcourse;
