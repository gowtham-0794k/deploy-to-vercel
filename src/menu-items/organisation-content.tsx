import { FormattedMessage } from "react-intl";
import { IconKey, IconBug } from "@tabler/icons-react";
import { NavItemType } from "types";

const icons = {
  IconKey,
  IconBug,
};

const Organization: NavItemType = {
  id: "Organisation-content",
  title: <FormattedMessage id="Orgization Content" />,
  icon: icons.IconKey,
  type: "group",
  children: [
    {
      id: "Institute-exam-evaluation-creator",
      title: <FormattedMessage id="Institute Exam Evaluation Creator" />,
      type: "item",
      icon: "/assets/logos/ASK Type 2.svg",
      url: "/pages/organisation-content/Institute-exam-evaluation-creator",
    },
    {
      id: "Institute-exam-evaluation-user",
      title: <FormattedMessage id="Institute Exam Evaluation User" />,
      type: "item",
      icon: "/assets/logos/ASK Type 2.svg",
      url: "/pages/organisation-content/Institute-exam-evaluation-user",
    },
  ],
};
export default Organization;
