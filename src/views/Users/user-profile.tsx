"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Profile from "components/users/account-profile/Profile3/Profile";
import Security from "components/users/account-profile/Profile3/Security";
import Notifications from "components/users/account-profile/Profile3/Notifications";
import MainCard from "ui-component/cards/MainCard";
import Subscriptions from "components/users/account-profile/Profile3/Subscription";
import { TabsProps } from "types";
import { ThemeMode } from "types/config";

function TabPanel({ children, value, index, ...other }: TabsProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Profile3 = () => {
  const theme = useTheme(),
    [value, setValue] = React.useState(0),
    handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

  return (
    <MainCard title="Account">
      <div>
        <Tabs
          value={value}
          indicatorColor="primary"
          onChange={handleChange}
          sx={{
            mb: 3,
            minHeight: "auto",
            "& button": {
              minWidth: 100,
            },
            "& a": {
              minHeight: "auto",
              minWidth: 10,
              py: 1.5,
              px: 1,
              mr: 2.25,
              color:
                theme.palette.mode === ThemeMode.DARK ? "grey.600" : "grey.900",
            },
            "& a.Mui-selected": {
              color: "primary.main",
            },
          }}
          aria-label="simple tabs example"
          variant="scrollable"
        >
          <Tab component={Link} href="#" label="Profile" {...a11yProps(0)} />
          <Tab component={Link} href="#" label="Security" {...a11yProps(1)} />
          <Tab
            component={Link}
            href="#"
            label="Subscriptions"
            {...a11yProps(2)}
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Profile />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Security />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Subscriptions />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Notifications />
        </TabPanel>
      </div>
    </MainCard>
  );
};
export default Profile3;
