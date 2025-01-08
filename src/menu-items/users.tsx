import { FormattedMessage } from 'react-intl';

// assets
import { IconKey, IconBug } from '@tabler/icons-react';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { NavItemType } from 'types';
// import CorporateFareIcon from '@mui/icons-material/CorporateFare';

// constant
const icons = {
  IconKey,
  IconBug
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const Organization: NavItemType = {
  id: 'Users',
  title: <FormattedMessage id="Users" />,
  icon: icons.IconKey,
  type: 'group',
  children: [
    {
      id: 'Profile',
      title: <FormattedMessage id=" User Profile" />,
      type: 'item',
      icon: MenuBookIcon,
      url: '/users/user-profile',
    },
    {
        id: 'Invite-Users',
        title: <FormattedMessage id="Invite Users" />,
        type: 'item',
        icon: MenuBookIcon,
        url: '/users/invite-users',
      },
      {
        id: 'Roles and Permissions',
        title: <FormattedMessage id="Roles and Permissions" />,
        type: 'item',
        icon: MenuBookIcon,
        url: '/users/roles-permissions'
      },
      {
        id: 'Invite-admin',
        title: <FormattedMessage id="Invite Admin" />,
        type: 'item',
        icon: MenuBookIcon,
        url: '/users/invite-admin'
      },
  ],
};
export default Organization;