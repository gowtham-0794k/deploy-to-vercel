import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

const OrganisationPackages: NavItemType = {
  id: "Organisation Packages",
  title: <FormattedMessage id="Organisation Package" />,
  icon: SentimentSatisfiedAltIcon,
  type: "group",
  children: [
    {
      id: "attach-packages",
      title: <FormattedMessage id="Attach Packages" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/organisationpackages/attach",
      breadcrumbs: true,
    },
    {
      id: "delete",
      title: <FormattedMessage id=" Delete Attachment" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/organisationpackages/delete",
    },
  ],
};
export default OrganisationPackages;
