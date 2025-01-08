import { FormattedMessage } from "react-intl";
import { NavItemType } from "types";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

const Organization: NavItemType = {
  id: "Accounting",
  title: <FormattedMessage id="Accounting" />,
  icon: SentimentSatisfiedAltIcon,
  type: "group",
  children: [
    {
      id: "Pricing-page-control",
      title: <FormattedMessage id="Pricing Page Control" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/pages/Accounting/Pricing-page-control",
    },
    {
      id: "Wallet-Details",
      title: <FormattedMessage id="Wallet Details" />,
      type: "item",
      icon: SentimentSatisfiedAltIcon,
      url: "/pages/Accounting/Wallet-Details",
    },
  ],
};
export default Organization;
