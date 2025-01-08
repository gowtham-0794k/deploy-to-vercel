import { memo, useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

// project imports
import NavItem from "./NavItem";
import NavGroup from "./NavGroup";
import useConfig from "hooks/useConfig";

import menuItem from "menu-items";
import { HORIZONTAL_MAX_ITEM } from "config";
import { useGetMenuMaster } from "shared/services/menu";

// types
import { NavItemType } from "types";
import { MenuOrientation } from "types/config";

const MenuList = () => {
  const theme = useTheme(),
    // { rolesAndPermissions } = useConfig(),
    downMD = useMediaQuery(theme.breakpoints.down("md")),
    { menuOrientation } = useConfig(),
    { menuMaster } = useGetMenuMaster(),
    drawerOpen = menuMaster.isDashboardDrawerOpened,
    isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD,
    [selectedID, setSelectedID] = useState<string | undefined>(""),
    lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;

  // const permissionsForMenuItems = rolesAndPermissions?.permissions?.features;

  // TODO:once add proper permissions in db un comment
  const roleAndPermissionsMenuItems = menuItem.items?.filter((item: any) => {
    // const getParentMenuItem = permissionsForMenuItems?.map((fItem: any) => {
    //   return {
    //     parent: fItem?.featureName?.toLowerCase()?.replace(/ /g, "_"),
    //     child: fItem?.subFeatures?.map((childItem: any) =>
    //       childItem?.subFeatureName?.toLowerCase()?.replace(/ /g, "_")
    //     ),
    //   };
    // });
    // const findGroup = getParentMenuItem?.find(
    //   (parentItem: any) => parentItem?.parent === item?.uniqueId
    // );
    // const findChildren = item?.children?.filter((childItem: any) => {
    //   const findChild = findGroup?.child?.find(
    //     (item: any) => item === childItem?.uniqueId
    //   );
    //   if (findChild) return findChild;
    // });
    // if (findGroup && findChildren?.length !== 0) {
    //   item.children = findChildren;
    //   return item;
    // }
    return item;
  });

  let lastItemIndex = roleAndPermissionsMenuItems.length - 1,
    remItems: NavItemType[] = [],
    lastItemId: string;

  if (lastItem && lastItem < roleAndPermissionsMenuItems.length) {
    lastItemId = roleAndPermissionsMenuItems[lastItem - 1].id!;
    lastItemIndex = lastItem - 1;
    remItems = roleAndPermissionsMenuItems
      .slice(lastItem - 1, roleAndPermissionsMenuItems.length)
      .map((item) => ({
        title: item.title,
        elements: item.children,
        icon: item.icon,
        ...(item.url && {
          url: item.url,
        }),
      }));
  }

  const navItems = roleAndPermissionsMenuItems
    .slice(0, lastItemIndex + 1)
    .map((item, index) => {
      switch (item.type) {
        case "group":
          if (item.url && item.id !== lastItemId) {
            return (
              <List key={item.id}>
                <NavItem
                  item={item}
                  level={1}
                  isParents
                  setSelectedID={() => setSelectedID("")}
                />
                {!isHorizontal && index !== 0 && <Divider sx={{ py: 0.5 }} />}
              </List>
            );
          }
          return (
            <NavGroup
              key={item.id}
              setSelectedID={setSelectedID}
              selectedID={selectedID}
              item={item}
              lastItem={lastItem!}
              remItems={remItems}
              lastItemId={lastItemId}
            />
          );
        default:
          return (
            <Typography key={item.id} variant="h6" color="error" align="center">
              Menu Items Error
            </Typography>
          );
      }
    });

  return !isHorizontal ? (
    <Box {...(drawerOpen && { sx: { mt: 1.5 } })}>{navItems}</Box>
  ) : (
    <>{navItems}</>
  );
};

export default memo(MenuList);
