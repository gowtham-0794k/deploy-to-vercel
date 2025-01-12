import { FormattedMessage } from "react-intl";

import { NavItemType } from "types";
// import CorporateFareIcon from '@mui/icons-material/CorporateFare';

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const Organization: NavItemType = {
  id: "Users",
  featureName: "Users",
  title: <FormattedMessage id="Users" />,
  icon: "/assets/logos/ASK Type 2.svg",
  type: "group",
  children: [
    {
      id: "Profile",
      subFeatureName: "Profile",
      title: <FormattedMessage id=" User Profile" />,
      type: "item",
      icon: "/assets/logos/ASK Type 2.svg",
      url: "/users/user-profile",
    },
    {
      id: "Invite-Users",
      subFeatureName: "Invite Users",
      title: <FormattedMessage id="Invite Users" />,
      type: "item",
      icon: "/assets/logos/ASK Type 2.svg",
      url: "/users/invite-users",
    },
    {
      id: "Roles and Permissions",
      subFeatureName: "Roles and Permissions",
      title: <FormattedMessage id="Roles and Permissions" />,
      type: "item",
      icon: "/assets/logos/ASK Type 2.svg",
      url: "/users/roles-permissions",
    },
    {
      id: "Invite-admin",
      subFeatureName: "Invite Admin",
      title: <FormattedMessage id="Invite Admin" />,
      type: "item",
      icon: "/assets/logos/ASK Type 2.svg",
      url: "/users/invite-admin",
    },
  ],
};
export default Organization;
