import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";

const Organisation: NavItemType = {
  id: "Organisation",
  featureName: "Organisation",
  title: <FormattedMessage id="Organisation" />,
  icon: "/assets/logos/ASK Type 2.svg",
  type: "group",
  children: [
    {
      id: "Create-Organisation",
      subFeatureName: "Create Organisation",
      title: <FormattedMessage id="Create Organisation" />,
      type: "item",
      icon: "/assets/logos/ASK Type 2.svg",
      url: "/organisation/create-organisation",
      breadcrumbs: true,
    },
    {
      id: "add-branding",
      subFeatureName: "Manage Branding",
      title: <FormattedMessage id=" Add Branding" />,
      type: "item",
      icon: "/assets/logos/ASK Type 2.svg",
      url: "/organisation/add-branding",
    },
    {
      id: "invite-super-admin",
      subFeatureName: "Invite Super Admin",
      title: <FormattedMessage id="Invite Super Admin" />,
      type: "item",
      icon: "/assets/logos/ASK Type 2.svg",
      url: "/organisation/invite-super-admin",
    },
    {
      id: "manage-tenants",
      subFeatureName: "Manage Organisations",
      title: <FormattedMessage id="Manage Tenants" />,
      type: "item",
      icon: "/assets/logos/ASK Type 2.svg",
      url: "/organisation/manage-tenants",
    },
    {
      id: "commercials",
      subFeatureName: "Manage Organisations",
      title: <FormattedMessage id="Commercials" />,
      type: "item",
      icon: "/assets/logos/ASK Type 2.svg",
      url: "/organisation/commercials",
    },
    {
      id: "assign-courses",
      subFeatureName: "Assign Courses",
      title: <FormattedMessage id="Assign Courses" />,
      type: "item",
      icon: "/assets/logos/ASK Type 2.svg",
      url: "/organisation/assign-courses",
      breadcrumbs: true,
    },
    {
      id: "assign-packages",
      subFeatureName: "Assign Sales Packages",
      title: <FormattedMessage id="Assign Packages" />,
      type: "item",
      icon: "/assets/logos/ASK Type 2.svg",
      url: "/organisation/assign-packages",
    },
  ],
};
export default Organisation;
