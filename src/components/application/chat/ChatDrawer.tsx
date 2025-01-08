// @ts-nocheck
"use client";

import { useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";

import InputLabel from "ui-component/extended/Form/InputLabel";
import Devider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";




// project imports
import UserList from "./UserList";
import useAuth from "hooks/useAuth";
import useConfig from "hooks/useConfig";
import MainCard from "ui-component/cards/MainCard";
import { appDrawerWidth as drawerWidth, gridSpacing } from "store/constant";

// types
import { ThemeMode } from "types/config";
import { UserProfile } from "types/user-profile";


// ==============================|| CHAT DRAWER ||============================== //
interface History extends Chat {
  id: number;
  user: UserProfile;
  history?: History[];
}
interface ChatDrawerProps {
  handleDrawerOpen: () => void
  openChatDrawer: boolean | undefined
  setUser: (u: UserProfile) => void
  history: import("/Users/admin/Desktop/Bitbucket(next js)/meramaster-nextjs-project/src/types/chat").History[]
}
interface Chat {
  text: string;
  time: string;
}

const ChatDrawer = ({
  handleDrawerOpen,
  openChatDrawer,
  setUser,
  history,
}: ChatDrawerProps) => {
  const theme = useTheme();

  const { user } = useAuth();
  const { borderRadius } = useConfig();
  const downLG = useMediaQuery(theme.breakpoints.down("lg"));

  // show menu to set current user status
  const [anchorEl, setAnchorEl] = useState<Element | (() => Element) | null | undefined>();
  const handleClickRightMenu = (
    event: React.MouseEvent<HTMLButtonElement> | undefined) => {setAnchorEl(event?.currentTarget);};

  const handleCloseRightMenu = () => {
    setAnchorEl(null);
  };
  const handleClickSort = (
    event: React.MouseEvent<HTMLButtonElement> | undefined) => {
    setAnchorEl(event?.currentTarget);
  };
  // set user status on status menu click
  const [status, setStatus] = useState("available");
  const handleRightMenuItemClick = (userStatus: string) => () => {
    setStatus(userStatus);
    handleCloseRightMenu();
  };
  const handleCloseSort = () => {
    setAnchorEl(null);
  };

  const drawerBG =
    theme.palette.mode === ThemeMode.DARK ? "dark.main" : "grey.50";
  return (
    <Drawer
     open={openChatDrawer}
      onClose={handleDrawerOpen}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        zIndex: { xs: 1100, lg: 0 },
        "& .MuiDrawer-paper": {
          height: { xs: "100%", lg: "auto" },
          width: drawerWidth,
          boxSizing: "border-box",
          position: "relative",
          border: "none",
          borderRadius: { sx: "none", lg: `${borderRadius}px` },
        },
      }}
      variant={downLG ? "temporary" : "persistent"}
      anchor="left"
      open={openChatDrawer}
      ModalProps={{ keepMounted: true }}
      onClose={handleDrawerOpen}
    >
      {openChatDrawer && (
        <MainCard
          sx={{ bgcolor: { xs: "transparent", lg: drawerBG }, height: "80vh" }}
          border={theme.palette.mode !== ThemeMode.DARK}
          content={false}
        >
          <Grid item sm zeroMinWidth />

          <Grid
            item
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <InputLabel sx={{ mt: 5 }}> History</InputLabel>
          </Grid>
          <Devider sx={{ mt: 2 }} />
          {/* <PerfectScrollbar component="div">
            <Box sx={{ p: 2 }}>
              <UserList setUser={setUser} />
              <MainCard>
                <Grid container spacing={gridSpacing}>
                {history?.map((chat: import("/Users/admin/Desktop/Bitbucket(next js)/meramaster-nextjs-project/src/types/chat").History, index: number) => (
                    <Grid item xs={12} key={index}>
                      <Box sx={{ p: 1, bgcolor: "grey.200", borderRadius: 1 }}>
                        <Typography variant="body2">{chat.text}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {chat.time}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </MainCard>
            </Box>
          </PerfectScrollbar> */}
        </MainCard>
      )}
    </Drawer>
  );
};

export default ChatDrawer;