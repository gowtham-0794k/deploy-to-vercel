import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";


const OrganisationPackages: NavItemType = {
  id: "Organisation Packages",
  title: <FormattedMessage id="Organisation Package" />,
  icon: "/assets/logos/ASK Type 2.svg",
  type: "group",
  children: [
    {
      id: "attach-packages",
      title: <FormattedMessage id="Attach Packages" />,
      type: "item",
      icon: "/assets/logos/ASK Type 2.svg",
      url: "/organisationpackages/attach",
      breadcrumbs: true,
    },
    {
      id: "delete",
      title: <FormattedMessage id=" Delete Attachment" />,
      type: "item",
      icon: "/assets/logos/ASK Type 2.svg",
      url: "/organisationpackages/delete",
    },
  ],
};
export default OrganisationPackages;
