import { memo, useEffect, useState } from "react";

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
import { useTenant } from "@components/tenantLayout";

function normalizeName(name: string): string {
  return name?.toLowerCase().replace(/ /g, "_");
}

function normalizeNameMenu(name: string): string {
  return name?.toLowerCase().replace(/ /g, "_").replace(/-/g, "_");
}

function filterMenuItemsByRoles(roles: any[], menuItems: any[]) {
  const featureSet = new Set<string>();
  const subFeatureSet = new Set<string>();
  console.log({ roles });
  console.log("filter menu items !");
  // Separate feature and sub-feature normalization
  roles?.forEach((feature) => {
    if (feature.enabled) {
      featureSet.add(normalizeName(feature.featureName));
      feature.subFeatures.forEach((subFeature: any) => {
        if (subFeature.enabled) {
          subFeatureSet.add(normalizeName(subFeature.subFeatureName));
        }
      });
    }
  });
  console.log({ featureSet });
  function filterMenu(item: any) {
    const idToMatch = normalizeNameMenu(item?.featureName);
    if (featureSet.has(idToMatch)) {
      let filteredChildren: any = [];
      if (item.children) {
        filteredChildren = item.children
          .map((child: any) => {
            const childIdToMatch = normalizeNameMenu(child?.subFeatureName);
            return subFeatureSet.has(childIdToMatch) ? child : null;
          })
          .filter(Boolean);

        if (filteredChildren.length > 0) {
          return { ...item, children: filteredChildren };
        }
        return null;
      }
      return {
        ...item,
        children: filteredChildren,
      };
    }
  }

  const matchedItems: any = [];
  menuItems.forEach((item) => {
    const filteredItem = filterMenu(item);
    if (filteredItem) matchedItems.push(filteredItem);
  });

  return matchedItems;
}

const MenuList = () => {
  const theme = useTheme(),
    { rolesAndPermissions } = useConfig(),
    { rolesResponse } = useTenant(),
    downMD = useMediaQuery(theme.breakpoints.down("md")),
    { menuOrientation } = useConfig(),
    { menuMaster } = useGetMenuMaster(),
    drawerOpen = menuMaster.isDashboardDrawerOpened,
    isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD,
    [selectedID, setSelectedID] = useState<string | undefined>(""),
    lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null,
    [roles, setRoles] = useState<any>([]);

  const menuItems: any = menuItem;

  console.log("rolesAndPermissions !");
  console.log({ rolesAndPermissions });
  console.log({ rolesResponse });

  useEffect(() => {
    if (rolesAndPermissions?.permissions?.features) {
      const mapData = filterMenuItemsByRoles(
        rolesAndPermissions?.permissions?.features,
        menuItems?.items
      );
      setRoles(mapData);
    }
  }, [rolesAndPermissions, rolesResponse]);

  console.log({ roles });

  let lastItemIndex = roles.length - 1,
    remItems: NavItemType[] = [],
    lastItemId: string;

  if (lastItem && lastItem < roles.length) {
    lastItemId = roles[lastItem - 1].id!;
    lastItemIndex = lastItem - 1;
    remItems = roles.slice(lastItem - 1, roles.length).map((item: any) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon,
      ...(item.url && {
        url: item.url,
      }),
    }));
  }

  const navItems = roles
    .slice(0, lastItemIndex + 1)
    .map((item: any, index: number) => {
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
