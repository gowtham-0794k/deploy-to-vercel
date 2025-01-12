"use client";
import React, { useEffect, useState, useLayoutEffect, useRef } from "react";

// material-ui
import { useTheme, styled, Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import UserDetails from "components/application/chat/UserDetails";
import ChatDrawer from "components/application/chat/ChatDrawer";

import Loader from "ui-component/Loader";
import MainCard from "ui-component/cards/MainCard";

import { dispatch, useSelector } from "store";
import { getUser, getUserChats, insertChat } from "store/slices/chat";
import { appDrawerWidth as drawerWidth, gridSpacing } from "store/constant";

// assets
import AttachmentTwoToneIcon from "@mui/icons-material/AttachmentTwoTone";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import CloseIcon from "@mui/icons-material/Close";
import MicTwoToneIcon from "@mui/icons-material/MicTwoTone";

// types
import { ThemeMode } from "types/config";
import { UserProfile } from "types/user-profile";
import { History as HistoryProps } from "types/chat";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// drawer content element
const Main = styled("main", {
  shouldForwardProp: (prop: string) => prop !== "open",
})(({ theme, open }: { theme: Theme; open: boolean }) => ({
  flexGrow: 1,
  paddingLeft: open ? theme.spacing(3) : 0,
  transition: theme.transitions.create("margin, width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.shorter,
  }),
  marginLeft: `${open ? 0 : -drawerWidth}px`,
  width: `calc(100% - ${open ? drawerWidth : 0}px)`,
  [theme.breakpoints.down("lg")]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    marginLeft: 0,
    width: "100%",
    ...(open && {
      position: "relative",
      zIndex: 1,
    }),
  },
}));

const ChatMainPage = () => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down("lg"));

  const [loading, setLoading] = useState<boolean>(true);

  const scrollRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollIntoView();
    }
  });

  const [emailDetails, setEmailDetails] = React.useState(false);
  const handleUserChange = (event?: React.SyntheticEvent) => {
    setEmailDetails((prev) => !prev);
  };

  const [openChatDrawer, setOpenChatDrawer] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpenChatDrawer((prevState) => !prevState);
  };

  useEffect(() => {
    if (downLG) {
      setOpenChatDrawer(false);
    } else {
      setOpenChatDrawer(true);
    }
  }, [downLG]);

  const [user, setUser] = useState<UserProfile>({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    isdCode: "",
  });
  const [data, setData] = React.useState<HistoryProps[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const chatState = useSelector((state) => state.chat);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const handleImageClick = (imageSrc: string) => {
    setPreviewImage(imageSrc);
    setIsPreviewOpen(true);
  };
  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
    setPreviewImage(null);
  };

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

  const [message, setMessage] = useState("");

  const handleOnSend = () => {
    if (!message.trim() && filePreviews.length === 0) return;

    const d = new Date();
    const newMessage = {
      from: "User1",
      to: user.name,
      text: message,
      files: [...filePreviews],
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setData((prevState) => [...prevState, newMessage]);

    setMessage("");
    setFilePreviews([]);
    dispatch(insertChat(newMessage));
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event?.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleOnSend();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedFiles = Array.from(event.target.files);
      const newPreviews = uploadedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setFilePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeAttachment = (index: number) => {
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMicClick = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log("Speech recognition started");
      setMessage((prevMessage) => `${prevMessage} (Listening...)`);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log("Transcript:", transcript);

      setMessage(
        (prevMessage) => prevMessage.replace(" (Listening...)", "") + transcript
      );
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setMessage((prevMessage) =>
        prevMessage.replace(" (Listening...)", " (Error occurred)")
      );
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      setMessage((prevMessage) => prevMessage.replace(" (Listening...)", ""));
    };

    recognition.start();
  };

  if (loading) return <Loader />;

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <ChatDrawer
        openChatDrawer={openChatDrawer}
        handleDrawerOpen={handleDrawerOpen}
        setUser={setUser}
      />
      <Main theme={theme} open={openChatDrawer}>
        <Grid container spacing={gridSpacing} justifyContent="center">
          <Grid
            item
            xs
            zeroMinWidth
            sx={{
              display: emailDetails ? { xs: "none", sm: "flex" } : "flex",
              width: "100%",
            }}
          >
            <MainCard
              sx={{
                bgcolor:
                  theme.palette.mode === ThemeMode.DARK
                    ? "dark.main"
                    : "grey.50",
                width: "100%",
                maxWidth: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Grid container spacing={gridSpacing} justifyContent="center">
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
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setData([]);
                          setMessage("");
                          setFilePreviews([]);
                        }}
                      >
                        New Chat
                      </Button>
                    </Grid>
                  </Grid>
                  <Divider sx={{ mt: 2 }} />
                </Grid>
                <PerfectScrollbar
                  style={{
                    width: "100%",
                    height: "calc(100vh - 450px)",
                    overflowX: "hidden",
                    overflowY: "hidden",
                  }}
                >
                  <Box sx={{ py: 3, pl: 4, pr: 1 }}>
                    {data.map((message, index) => (
                      <Box
                        key={index}
                        sx={{
                          marginBottom: 2,
                          display: "flex",
                          justifyContent:
                            message.from === "User1"
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                        <Box
                          key={index}
                          sx={{
                            bgcolor:
                            message.from === "User1"
                            ? theme.palette.mode === "dark"
                              ? theme.palette.primary.dark
                              : theme.palette.primary.light
                            : theme.palette.mode === "dark"
                            ? theme.palette.grey[800]
                            : theme.palette.grey[300],
                            color:
                            message.from === "User1"
                            ? theme.palette.mode === "dark"
                              ? "white"
                              : "black"
                            : theme.palette.mode === "dark"
                            ? "white"
                            : "black",

                            padding: 2,
                            borderRadius: 2,
                            width: "auto",
                            maxWidth: "85%", // Prevents the bubble from getting too wide
                            boxShadow: theme.shadows[2],
                            wordWrap: "break-word", // Prevents overflow of long text
                            overflowWrap: "break-word", // Ensures text wraps nicely
                            display: "inline-block",
                          }}
                        >
                          <strong>{message.from}:</strong> {message.text}
                          {message.files && message.files.length > 0 && (
                            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                              {message.files.map((file, i) => (
                                <img
                                  key={i}
                                  src={file}
                                  alt={`attachment-${i}`}
                                  onClick={() => handleImageClick(file)}
                                  style={{
                                    width: "100%",             // Full width for small screens
            maxWidth: "150px",        // Limit max width for larger screens
            height: "auto",           // Maintain aspect ratio
            objectFit: "cover",
            borderRadius: "8px",
            cursor: "pointer",
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor:
              message.from === "User1"
                ? theme.palette.mode === "dark"
                  ? theme.palette.primary.dark
                  : theme.palette.primary.light
                : theme.palette.mode === "dark"
                ? theme.palette.grey[800]
                : theme.palette.grey[400],
            padding: "4px",
          }}
        />
      ))}
                            </Box>
                          )}
                          <Box
                            sx={{
                              fontSize: "0.75em",
                              color: theme.palette.text.primary,
                              marginTop: 1,
                              textAlign: "right",
                            }}
                          >
                            {message.time}
                          </Box>
                        </Box>
                      </Box>
                    ))}
                    <span ref={scrollRef} />
                  </Box>
                </PerfectScrollbar>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Grid
                    container
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid item xs={12} sm={10} md={8} lg={6} zeroMinWidth>
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: "200px", // Fixed container height
                          display: "flex",
                          flexDirection: "column-reverse", // Makes content grow upward
                        }}
                      >
                        <TextField
                          fullWidth
                          value={message}
                          onKeyDown={handleEnter}
                          onChange={(event) => setMessage(event.target.value)}
                          placeholder="Type a message or paste an image"
                          multiline
                          maxRows={8}
                          sx={{
                            "& .MuiInputBase-root": {
                              maxHeight: "200px",
                              overflowY: "auto",
                            },
                            "& .MuiInputBase-input": {
                              maxHeight: "180px", // Slightly less than container to account for padding
                              overflow: "auto",
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <Stack direction="row" alignItems="center">
                                <IconButton
                                  size="large"
                                  aria-label="mic"
                                  onClick={handleMicClick}
                                >
                                  <MicTwoToneIcon />
                                </IconButton>
                                {filePreviews.length > 0 &&
                                  filePreviews.map((filePreview, index) => (
                                    <Box
                                      key={index}
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        position: "relative",
                                        borderRadius: "4px",
                                        overflow: "hidden",
                                        width: 60,
                                        height: 60,
                                        marginLeft: 1,
                                        background: "none",
                                      }}
                                    >
                                      <img
                                        src={filePreview}
                                        alt="attachment preview"
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                        }}
                                      />
                                      <IconButton
                                        onClick={() => removeAttachment(index)}
                                        sx={{
                                          position: "absolute",
                                          top: -8,
                                          right: -8,
                                          backgroundColor:
                                            theme.palette.error.main,
                                          color: "#fff",
                                          zIndex: 2,
                                          fontSize: "0.6rem",
                                          borderRadius: "50%",
                                          boxShadow: theme.shadows[1],
                                        }}
                                      >
                                        <CloseIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  ))}
                              </Stack>
                            ),
                            endAdornment: (
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Input
                                  type="file"
                                  style={{ display: "none" }}
                                  id="file-upload"
                                  inputProps={{ multiple: true }}
                                  onChange={handleFileUpload}
                                />
                                <label htmlFor="file-upload">
                                  <IconButton
                                    component="span"
                                    aria-label="attachment"
                                  >
                                    <AttachmentTwoToneIcon />
                                  </IconButton>
                                </label>
                                <IconButton
                                  color="primary"
                                  aria-label="send"
                                  onClick={handleOnSend}
                                >
                                  <SendTwoToneIcon />
                                </IconButton>
                              </Stack>
                            ),
                          }}
                        />
                      </Box>
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
      <Dialog open={isPreviewOpen} onClose={handlePreviewClose} maxWidth="lg">
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.palette.background.default,
          }}
        >
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: "90vw",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handlePreviewClose}
            variant="contained"
            color="error"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatMainPage;
