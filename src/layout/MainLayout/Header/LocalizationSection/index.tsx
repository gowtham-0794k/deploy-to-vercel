import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import Transitions from 'ui-component/extended/Transitions';
import useConfig from 'hooks/useConfig';

// assets

import Language from '@mui/icons-material/Language';

// types
import { I18n, ThemeMode } from 'types/config';


const LocalizationSection = () => {
  const { borderRadius, i18n, onChangeLocale } = useConfig();

  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);
  const anchorRef = useRef<any>(null);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLDivElement, MouseEvent> | undefined,
    lng: I18n
  ) => {
    onChangeLocale(lng);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Box sx={{ ml: { xs: 0, sm: 2 } }}>
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            border: '1px solid',
            borderColor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'primary.light',
            bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'primary.light',
            color: 'primary.dark',
            transition: 'all .2s ease-in-out',
            '&[aria-controls="menu-list-grow"],&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'primary.main',
              color: 'primary.light'
            }
          }}
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          color="inherit"
        >
          {i18n !== 'en' && (
            <Typography variant="h5" sx={{ textTransform: 'uppercase' }} color="inherit">
              {i18n}
            </Typography>
          )}
          {i18n === 'en' && <Language  sx={{ fontSize: '1.3rem' }} />}
        </Avatar>
      </Box>
      <Popper
        placement={downMD ? 'bottom-start' : 'bottom'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [downMD ? 0 : 0, 20]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions position={downMD ? 'top-left' : 'top'} in={open} {...TransitionProps}>
              <Paper elevation={16}>
                {open && (
                  <List
                    component="nav"
                    sx={{
                      width: '100%',
                      minWidth: 200,
                      maxWidth: 280,
                      bgcolor: theme.palette.background.paper,
                      borderRadius: `${borderRadius}px`,
                      [theme.breakpoints.down('md')]: {
                        maxWidth: 250
                      }
                    }}
                  >
                    <ListItemButton selected={i18n === 'en'} onClick={(event) => handleListItemClick(event, 'en')}>
                      <ListItemText
                        primary={
                          <Grid container>
                            <Typography color="textPrimary">English</Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ ml: '8px' }}>
                              (UK)
                            </Typography>
                          </Grid>
                        }
                      />
                    </ListItemButton>
                    <ListItemButton selected={i18n === 'fr'} onClick={(event) => handleListItemClick(event, 'fr')}>
                      <ListItemText
                        primary={
                          <Grid container>
                            <Typography color="textPrimary">français</Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ ml: '8px' }}>
                              (French)
                            </Typography>
                          </Grid>
                        }
                      />
                    </ListItemButton>
                    <ListItemButton selected={i18n === 'kn'} onClick={(event) => handleListItemClick(event, 'kn')}>
                      <ListItemText
                        primary={
                          <Grid container>
                            <Typography color="textPrimary">ಕನ್ನಡ</Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ ml: '8px' }}>
                              (Kannada)
                            </Typography>
                          </Grid>
                        }
                      />
                    </ListItemButton>
                    <ListItemButton selected={i18n === 'hi'} onClick={(event) => handleListItemClick(event, 'hi')}>
                      <ListItemText
                        primary={
                          <Grid container>
                            <Typography color="textPrimary">हिंदी</Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ ml: '8px' }}>
                              (Hindi)
                            </Typography>
                          </Grid>
                        }
                      />
                    </ListItemButton>
                    <ListItemButton selected={i18n === 'te'} onClick={(event) => handleListItemClick(event, 'te')}>
                      <ListItemText
                        primary={
                          <Grid container>
                            <Typography color="textPrimary">తెలుగు</Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ ml: '8px' }}>
                              (Telugu)
                            </Typography>
                          </Grid>
                        }
                      />
                    </ListItemButton>
                  </List>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};
export default LocalizationSection;
