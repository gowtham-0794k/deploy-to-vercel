import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FormattedMessage } from "react-intl";
import PerfectScrollbar from "react-perfect-scrollbar";
import MainCard from "ui-component/cards/MainCard";
import Transitions from "ui-component/extended/Transitions";
import { signOut, useSession } from "next-auth/react";
import { ThemeMode } from "types/config";
import { IconLogout, IconSettings } from "@tabler/icons-react";
import useConfig from "hooks/useConfig";

const User1 = "/assets/images/users/user-round.svg";

const ProfileSection = () => {
  const { data: session } = useSession(),
    theme = useTheme(),
    userData: any = session?.user,
    { roleName, first_name, last_name, email } = userData?._doc,
    { borderRadius } = useConfig(),
    [open, setOpen] = useState(false),
    anchorRef = useRef<any>(null),
    handleLogout = async () => {
      try {
        await signOut({ callbackUrl: "/login" });
      } catch (err) {
        console.error("Error during logout:", err);
      }
    },
    handleClose = (
      event: React.MouseEvent<HTMLDivElement> | MouseEvent | TouchEvent
    ) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }

      setOpen(false);
    },
    handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    },
    prevOpen = useRef(open);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          height: "48px",
          alignItems: "center",
          borderRadius: "27px",
          transition: "all .2s ease-in-out",
          borderColor:
            theme.palette.mode === ThemeMode.DARK
              ? "dark.main"
              : "primary.light",
          bgcolor:
            theme.palette.mode === ThemeMode.DARK
              ? "dark.main"
              : "primary.light",
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: "primary.main",
            bgcolor: `${theme.palette.primary.main} !important`,
            color: "primary.light",
            "& svg": {
              stroke: theme.palette.primary.main,
            },
          },
          "& .MuiChip-label": {
            lineHeight: 0,
          },
        }}
        icon={
          <Avatar
            src={User1}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: "8px 0 8px 8px !important",
              cursor: "pointer",
            }}
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            color="inherit"
            alt="user images"
          />
        }
        label={<IconSettings stroke={1.5} size="24px" />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 14],
            },
          },
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard
                    border={false}
                    elevation={16}
                    content={false}
                    boxShadow
                    shadow={theme.shadows[16]}
                  >
                    <Box sx={{ p: 2, pb: 0 }}>
                      <Stack>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <Typography
                            component="span"
                            variant="h4"
                            sx={{ fontWeight: 400 }}
                          >
                            {first_name || last_name
                              ? first_name + " " + last_name
                              : email}
                          </Typography>
                        </Stack>
                        <Typography variant="subtitle2">{roleName}</Typography>
                      </Stack>
                    </Box>
                    <PerfectScrollbar
                      style={{
                        height: "100%",
                        maxHeight: "calc(100vh - 250px)",
                        overflowX: "hidden",
                      }}
                    >
                      <Box sx={{ p: 2, pt: 0 }}>
                        <List
                          component="nav"
                          sx={{
                            width: "100%",
                            maxWidth: 350,
                            minWidth: 300,
                            bgcolor: theme.palette.background.paper,
                            borderRadius: `${borderRadius}px`,
                            "& .MuiListItemButton-root": { mt: 0.5 },
                          }}
                        >
                          <ListItemButton
                            sx={{ borderRadius: `${borderRadius}px` }}
                            onClick={handleLogout}
                          >
                            <ListItemIcon>
                              <IconLogout stroke={1.5} size="20px" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2">
                                  <FormattedMessage id="logout" />
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </List>
                      </Box>
                    </PerfectScrollbar>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
