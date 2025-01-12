"use client";

import React, { useEffect, useState, useLayoutEffect, useRef } from "react";

// material-ui


// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports





// assets
import AttachmentTwoToneIcon from "@mui/icons-material/AttachmentTwoTone";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import Icon from "@mdi/react";
import { mdiMicrophone } from "@mdi/js";
import MoreHorizTwoToneIcon from "@mui/icons-material/MoreHorizTwoTone";



// types
import { ThemeMode } from "types/config";
import { UserProfile } from "types/user-profile";
import { History as HistoryProps } from "types/chat";
import { Box, Divider, Grid, IconButton, InputAdornment, MainCard, Menu, MenuItem, OutlinedInput, Stack, styled, Typography, useMediaQuery, useTheme } from "utils/genericExports/theme-imports";
import { ChatDrawer, ChatHistory, dispatch, drawerWidth, getUser, getUserChats, gridSpacing, insertChat, Loader, UserDetails, useSelector } from "utils/genericExports/uiComponentsimports";
import { Theme } from '@mui/material/styles';
// drawer content element
const Main = styled("main", {
  shouldForwardProp: (prop: string) => prop !== "open",
})(({ theme, open }: { theme: Theme; open: boolean }) => ({
  flexGrow: 1,
  paddingLeft: open ? theme.spacing(3) : 0,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.shorter,
  }),
  marginLeft: `-${drawerWidth}px`,
  [theme.breakpoints.down("lg")]: {
    paddingLeft: 0,
    marginLeft: 0,
  },
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.shorter,
    }),
    marginLeft: 0,
  }),
}));

const ChatMainPage = () => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down("lg"));
  const [loading, setLoading] = useState<boolean>(true);
  const scrollRef = useRef();
  // const [_, setHistory] = useState<HistoryProps[]>([]);
  const defaultUser: UserProfile = {
    id: undefined,
    name: "",
    email: "",
    avatar: "",
    status: "",
    location: "",
    friends: 0,
    followers: 0,
    unReadChatCount: 0,
    password: "",
    mobileNumber: "",
    isdCode: "",
  };

  useLayoutEffect(() => {
    if (scrollRef?.current) {
      // @ts-ignore
      scrollRef.current.scrollIntoView();
    }
  });

  const [anchorEl, setAnchorEl] = React.useState<
    Element | (() => Element) | null | undefined
  >(null);
  const handleClickSort = (
    event: React.MouseEvent<HTMLButtonElement> | undefined
  ) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleCloseSort = () => {
    setAnchorEl(null);
  };

  const [emailDetails, setEmailDetails] = React.useState(false);
  const handleUserChange = (...args: any[]) => {
    setEmailDetails((prev) => !prev);
  };
  const [openChatDrawer, setOpenChatDrawer] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpenChatDrawer((prevState) => !prevState);
  };

  // close sidebar when widow size below 'md' breakpoint
  useEffect(() => {
    setOpenChatDrawer(!downLG);
  }, [downLG]);

 
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [data, setData] = React.useState<HistoryProps[]>([]);
  const chatState = useSelector((state) => state.chat);

  useEffect(() => {
    setUser(chatState.user);
  }, [chatState.user]);

  useEffect(() => {
    setData(chatState.chats);
  }, [chatState.chats]);

  useEffect(() => {
    dispatch(getUser(1)).then(() => setLoading(false));
  }, []);

  useEffect(() => {
    dispatch(getUserChats(user.name));
  }, [user]);

  // handle new message form
  const [message, setMessage] = useState("");
  const handleOnSend = () => {
    const d = new Date();
    setMessage("");
    const newMessage = {
      from: "User1",
      to: user.name,
      text: message,
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setData((prevState) => [...prevState, newMessage]);
    dispatch(insertChat(newMessage));
  };

  const handleEnter = (
    event: React.KeyboardEvent<HTMLDivElement> | undefined
  ) => {
    if (event?.key !== "Enter") {
      return;
    }
    handleOnSend();
  };

  if (loading) return <Loader />;
  // const handleNewChat = () => {
  //   if (data.length > 0) {
  //     setHistory((prevHistory) => [...prevHistory, ...data]);
  //     dispatch({
  //       type: "STORE_CHAT_HISTORY",
  //       payload: { timestamp: new Date(), messages: [...data] },
  //     });
  //   }
  //   setData([]);
  // };
  
// const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//   const file = event.target.files?.[0];
//   if (file) {
//     const fileType = file.type;
//     if (
//       fileType.includes("image/jpeg") ||
//       fileType.includes("image/png") ||
//       fileType.includes("image/jpg")
//     ) {
//       setMessage(URL.createObjectURL(file)); 
//       console.log("Selected file:", file);
//     } else {
//       console.log("Unsupported file type. Only JPG, PNG, and screenshots are allowed.");
//     }
//   }
// };

// Function to handle attachment icon click
// const handleAttachmentClick = () => { 
//   fileInputRef.current?.click();
// };

  return (
    <Box sx={{ display: "flex" }}>
      <ChatDrawer
        openChatDrawer={openChatDrawer}
        handleDrawerOpen={handleDrawerOpen}
        setUser={setUser}
      
      />
      <Main theme={theme} open={openChatDrawer}>
        <Grid container spacing={gridSpacing}>
          <Grid
            item
            xs
            zeroMinWidth
            sx={{ display: emailDetails ? { xs: "none", sm: "flex" } : "flex" }}
          >
            <MainCard
              sx={{
                bgcolor:
                  theme.palette.mode === ThemeMode.DARK
                    ? "dark.main"
                    : "grey.50",
                      width: "100%"
              }}
            >
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  <Grid container alignItems="center" spacing={0.5}>
                    <Grid item>
                      <IconButton
                        onClick={handleDrawerOpen}
                        size="large"
                        aria-label="click to menu collapse"
                      >
                        <MenuRoundedIcon />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        sx={{ flexWrap: "nowrap" }}
                      >
                        <Grid item sm zeroMinWidth>
                          <Grid container spacing={0} alignItems="center">
                            <Grid item xs={12}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.25}
                              >
                                <Typography variant="h4">
                                  {user.name}
                                </Typography>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item sm zeroMinWidth />

                    <Grid item>
                      <IconButton
                        onClick={handleClickSort}
                        size="large"
                        aria-label="more options"
                      >
                        <MoreHorizTwoToneIcon />
                      </IconButton>
                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleCloseSort}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        <MenuItem >New Chat</MenuItem>
                      </Menu>
                    </Grid>
                  </Grid>
                  <Divider sx={{ mt: 2 }} />
                </Grid>
                <PerfectScrollbar
                  style={{
                    width: "100%",
                    height: "calc(100vh - 440px)",
                    overflowX: "hidden",
                    minHeight: 525,
                  }}
                >
                  <Box sx={{ py: 3, pl: 4, pr: 1 }}>
                    <ChatHistory theme={theme} user={user} data={data} />
                    {/* @ts-ignore */}
                    <span ref={scrollRef} />
                  </Box>
                </PerfectScrollbar>
                <Grid item xs={12}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs zeroMinWidth>
                      <OutlinedInput
                        fullWidth
                        value={message}
                        onKeyPress={handleEnter}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder="Type a message"
                        startAdornment={
                          <InputAdornment position="start">
                            <Icon path={mdiMicrophone} size={1} />
                          </InputAdornment>
                        }
                        endAdornment={
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <IconButton aria-label="attachment">
                              <AttachmentTwoToneIcon
                                style={{ fontSize: "1.25rem" }}
                              />
                            </IconButton>
                            <IconButton
                              color="primary"
                              aria-label="send"
                              onClick={handleOnSend}
                            >
                              <SendTwoToneIcon
                                style={{ fontSize: "1.25rem" }}
                              />
                            </IconButton>
                          </Stack>
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          {emailDetails && (
            <Grid item sx={{ margin: { xs: "0 auto", md: "initial" } }}>
              <Box
                sx={{
                  display: { xs: "block", sm: "none", textAlign: "right" },
                }}
              >
              <IconButton
  onClick={(event) => handleUserChange(event)}
  aria-label="highlight"
  sx={{ mb: -5 }}
  size="large"
>
  <HighlightOffTwoToneIcon />
</IconButton>
              </Box>
              <UserDetails user={user} handleUserChange={handleUserChange} />
            </Grid>
          )}
        </Grid>
      </Main>
    </Box>
  );
};

export default ChatMainPage;
