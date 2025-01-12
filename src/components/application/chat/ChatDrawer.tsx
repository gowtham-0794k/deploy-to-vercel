'use client'
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PerfectScrollbar from "react-perfect-scrollbar";
import Drawer from "@mui/material/Drawer";
import MainCard from "ui-component/cards/MainCard";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

// Mock or replace the following imports with actual ones from your project
import {
  dispatch,
  drawerWidth,
  getUserChats,
  gridSpacing,
} from "utils/genericExports/uiComponentsimports";
import useConfig from "hooks/useConfig";

const ThemeMode = {
  DARK: "dark",
  LIGHT: "light",
};

// const useAuth = () => ({
//   user: { name: "Default User" },
// });

interface HistoryProps {
  user: {
    name: string;
  };
  lastMessage: string;
  timestamp: string;
}

interface ChatDrawerProps {
  handleDrawerOpen: () => void;
  openChatDrawer: boolean;
  setUser: (user: any) => void;
}

const ChatDrawer = ({
  handleDrawerOpen,
  openChatDrawer,
  setUser,
}: ChatDrawerProps) => {
  const theme = useTheme();
  const { borderRadius } = useConfig();
  const downLG = useMediaQuery(theme.breakpoints.down("lg"));

  const [chatHistory, setChatHistory] = useState<HistoryProps[]>([
    {
      user: { name: "John Doe" },
      lastMessage: "Hello, how are you?",
      timestamp: new Date().toISOString(),
    },
    {
      user: { name: "Jane Smith" },
      lastMessage: "Let's discuss the project tomorrow.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      user: { name: "Alice Johnson" },
      lastMessage: "Thanks for the update!",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      user: { name: "Bob Wilson" },
      lastMessage: "Project requirements received.",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedChat, setSelectedChat] = useState<HistoryProps | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [_, setEditingChatId] = useState<number | null>(null);

  const handleChatSelect = (chat: HistoryProps) => {
    setUser(chat.user);
    dispatch(getUserChats(chat.user.name));
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    chat: HistoryProps
  ) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedChat(chat);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedChat(null);
  };

  const handleRename = () => {
    setIsEditing(true);
    setEditedName(selectedChat?.user.name || "");
    const chatIndex = chatHistory.findIndex((chat) => chat === selectedChat);
    setEditingChatId(chatIndex);
    handleMenuClose();
  };

  const handleNameChange = (chat: HistoryProps, newName: string) => {
    if (!newName.trim()) return;

    setChatHistory((prevChats) =>
      prevChats.map((c) =>
        c === chat ? { ...c, user: { ...c.user, name: newName } } : c
      )
    );

    setIsEditing(false);
    setEditingChatId(null);
  };

  const handleDelete = () => {
    setChatHistory(chatHistory.filter((chat) => chat !== selectedChat));
    handleMenuClose();
  };

  const drawerBG =
    theme.palette.mode === ThemeMode.DARK ? "dark.main" : "grey.50";

  const categorizeChats = () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    const categorized = {
      today: [] as HistoryProps[],
      yesterday: [] as HistoryProps[],
      previousWeek: [] as HistoryProps[],
    };

    chatHistory.forEach((chat) => {
      const chatDate = new Date(chat.timestamp);

      if (chatDate.toDateString() === today.toDateString()) {
        categorized.today.push(chat);
      } else if (chatDate.toDateString() === yesterday.toDateString()) {
        categorized.yesterday.push(chat);
      } else if (chatDate > lastWeek) {
        categorized.previousWeek.push(chat);
      }
    });

    return categorized;
  };

  const groupedChats = categorizeChats();

  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          zIndex: { xs: 1200, lg: 0 },
          "& .MuiDrawer-paper": {
            height: {
              // xs: "calc(100vh - 120px)", // Increased from 170px
              // lg: "calc(100vh - 375px)"  // Increased from 425px
            },
            width: drawerWidth,
            boxSizing: "border-box",
            position: "relative",
            border: "none",
            borderRadius: { lg: `${borderRadius}px` },
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
            sx={{ bgcolor: { xs: "transparent", lg: drawerBG } }}
            border={theme.palette.mode !== ThemeMode.DARK}
            content={false}
          >
            <Box sx={{ p: 3, pb: 2 }}>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  <Typography variant="h3">History</Typography>
                </Grid>
              </Grid>
            </Box>
            <PerfectScrollbar
              style={{
                overflowX: "scroll",
                height: downLG ? "calc(100vh - 240px)" : "calc(100vh - 175px)", // Updated to match new drawer heights
                minHeight: downLG ? 0 : 700,
              }}
            >
              <Box sx={{ p: 3, pt: 0 }}>
                {Object.entries(groupedChats).map(([category, chats]) => (
                  <Box key={category}>
                    <Typography variant="h4" sx={{ mt: 2 }}>
                      {category === "today"
                        ? "Today"
                        : category === "yesterday"
                          ? "Yesterday"
                          : "Previous Week"}
                    </Typography>
                    {chats.map((chat, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                          padding: 1,
                          borderRadius: 1,
                          "&:hover": { bgcolor: theme.palette.action.hover },
                        }}
                      >
                        <Box onClick={() => handleChatSelect(chat)}>
                          {isEditing && selectedChat === chat ? (
                            <TextField
                              size="small"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)} // Update local state
                              onBlur={() => handleNameChange(chat, editedName)} // Save on blur
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleNameChange(chat, editedName); // Save on Enter
                                }
                              }}
                              autoFocus
                            />
                          ) : (
                            <>
                              <Typography variant="body1">
                                {chat.user.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: theme.palette.text.secondary }}
                              >
                                {chat.lastMessage}
                              </Typography>
                            </>
                          )}
                        </Box>

                        <IconButton
                          size="small"
                          aria-label="options"
                          onClick={(event) => handleMenuOpen(event, chat)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            </PerfectScrollbar>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleRename}>Rename</MenuItem>
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
          </MainCard>
        )}
      </Drawer>
      
    </>
  );
};

export default ChatDrawer;
