"use client";

import React, { useEffect, useState, useLayoutEffect, useRef } from "react";

// material-ui
import { useTheme, styled, Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";
import UserDetails from "components/application/chat/UserDetails";
import ChatDrawer from "components/application/chat/ChatDrawer";
import ChatHistory from "components/application/chat/ChatHistory";
import { History as HistoryProps } from "types/chat";
import Loader from "ui-component/Loader";

import MainCard from "ui-component/cards/MainCard";

import { dispatch, useSelector } from "store";
import { getUser, getUserChats, insertChat } from "store/slices/chat";
import { appDrawerWidth as drawerWidth, gridSpacing } from "store/constant";

// assets
import AttachmentTwoToneIcon from "@mui/icons-material/AttachmentTwoTone";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import MoreHorizTwoToneIcon from "@mui/icons-material/MoreHorizTwoTone";
import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";

// types
import { ThemeMode } from "types/config";
import { UserProfile } from "types/user-profile";
import Icon from "@mdi/react";
import { mdiMicrophone } from "@mdi/js";

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

// const ChatHistoryWrapper = styled("div")(({ theme }) => ({
//   backgroundColor: "transparent",
//   padding: theme.spacing(2),
//   borderRadius: theme.shape.borderRadius,
// }));
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

const ChatMainPage = () => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down("lg"));
  const [loading, setLoading] = useState<boolean>(true);
  const [history, setHistory] = useState<HistoryProps[]>([]);
  const [data, setData] = useState<HistoryProps[]>([]);
  const scrollRef = useRef<HTMLSpanElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type;
      if (
        fileType.includes("image/jpeg") ||
        fileType.includes("image/png") ||
        fileType.includes("image/jpg")
      ) {
        // Handle the selected file (e.g., upload or display it)
        console.log("Selected file:", file);
      } else {
        console.log(
          "Unsupported file type. Only JPG, PNG, and screenshots are allowed."
        );
      }
    }
  };
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  useLayoutEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollIntoView();
    }
  });

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const handleClickSort = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSort = () => {
    setAnchorEl(null);
  };
  const [emailDetails, setEmailDetails] = useState(false);
  const handleUserChange = () => {
    setEmailDetails((prev) => !prev);
  };
  const [openChatDrawer, setOpenChatDrawer] = useState(true);
  const handleDrawerOpen = () => {
    setOpenChatDrawer((prevState) => !prevState);
  };
  useEffect(() => {
    setOpenChatDrawer(!downLG);
  }, [downLG]);

  const [user, setUser] = useState<UserProfile>(defaultUser);
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
    if (user.name) {
      dispatch(getUserChats(user.name));
    }
  }, [user]);

  // handle new message form
  const [message, setMessage] = useState("");
  const handleOnSend = () => {
    const d = new Date();
    setMessage("");
    const newMessage: HistoryProps = {
      from: "User1",
      to: user.name,
      text: message ?? "",
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      id: Date.now(),
    };
    setData((prevState) => [...prevState, newMessage]);
    dispatch(insertChat(newMessage));
  };

  const handleNewChat = () => {
    if (data.length > 0) {
      setHistory((prevHistory) => [...prevHistory, ...data]);
      dispatch({
        type: "STORE_CHAT_HISTORY",
        payload: { timestamp: new Date(), messages: [...data] },
      });
    }
    setData([]);
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter") {
      return;
    }
    handleOnSend();
  };
  if (loading) return <Loader />;
  return (
    <Box sx={{ display: "flex" }}>
      <ChatDrawer
        openChatDrawer={openChatDrawer}
        handleDrawerOpen={() => setOpenChatDrawer((prev) => !prev)}
        setUser={setUser}
        history={history}
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
                width: "100%",
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
                        <MenuItem onClick={handleNewChat}>New Chat</MenuItem>
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
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/jpg"
                              style={{ display: "none" }}
                              ref={fileInputRef}
                              onChange={handleFileSelect}
                            />
                            <IconButton
                              aria-label="attachment"
                              onClick={handleAttachmentClick}
                            >
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
                  onClick={handleUserChange}
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
