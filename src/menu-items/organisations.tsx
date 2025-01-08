import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

const Organisation: NavItemType = {
  id: "Organisation",
  uniqueId: "organisation",
  title: <FormattedMessage id="Organisation" />,
  icon: SentimentSatisfiedAltIcon,
  type: "group",
  children: [
    {
      id: "Create-Organisation",
      uniqueId: "create_organization",
      title: <FormattedMessage id="Create Organisation" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/organisation/create-organisation",
      breadcrumbs: true,
    },
    {
      id: "add-branding",
      uniqueId: "add_branding",
      title: <FormattedMessage id=" Add Branding" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/organisation/add-branding",
    },
    {
      id: "invite-super-admin",
      uniqueId: "invite_super-admin",
      title: <FormattedMessage id="Invite Super Admin" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/organisation/invite-super-admin",
    },
    {
      id: "manage-tenants",
      uniqueId: "manage_tenants",
      title: <FormattedMessage id="Manage Tenants" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/organisation/manage-tenants",
    },
    {
      id: "commercials",
      uniqueId: "commercials",
      title: <FormattedMessage id="Commercials" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/organisation/commercials",
    },
    {
      id: "assign-courses",
      uniqueId: "assign_course",
      title: <FormattedMessage id="Assign Courses" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/organisation/assign-courses",
      breadcrumbs: true,
    },
    {
      id: "assign-packages",
      uniqueId: "assign_packages",
      title: <FormattedMessage id="Assign Packages" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/organisation/assign-packages",
    },
  ],
};
export default Organisation;
