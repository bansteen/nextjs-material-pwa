import MenuCloseIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Switch from '@mui/material/Switch';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Actions, useAppShell } from 'components/providers/AppShellProvider';
import { ThemeSwitch } from 'components/ThemeSwitch';
import HelpIcon from '@mui/icons-material/Help';

export function AppToolbar() {
  const theme = useTheme();
  const { state, dispatch } = useAppShell();
  const [releaseNotesDialogOpen, setReleaseNotesDialogOpen] = useState(false);

  const openMobileDrawer = () => {
    dispatch({ type: Actions.MOBILE_DRAWER_IS_OPEN, payload: true });
  };

  const toggleDesktopDrawer = () => {
    dispatch({
      type: Actions.DESKTOP_DRAWER_IS_OPEN,
      payload: !state.desktopDrawerIsOpen,
    });
  };

  const toggleBottomNav = () => {
    dispatch({
      type: Actions.SHOW_BOTTOM_NAV,
      payload: !state.showBottomNav,
    });
  };

  const toggleTheme = () => {
    dispatch({
      type: Actions.SET_THEME,
      payload: state.theme === 'dark' ? 'light' : 'dark',
    });
  };

  const openUserManual = () => {
    window.open(
      'https://www.notion.so/pokota/146ea28e28064be89b7b45c68f3e6d6a',
      '_blank'
    );
  };

  const openReleaseNotesDialog = () => {
    setReleaseNotesDialogOpen(true);
  };

  const closeReleaseNotesDialog = () => {
    setReleaseNotesDialogOpen(false);
  };

  return (
    <>
      <AppBar
        color={theme.palette.mode === 'light' ? 'primary' : 'default'}
        position="fixed"
        elevation={0}
      >
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={openMobileDrawer}
              sx={{
                mr: 2,
                display: {
                  md: 'none',
                },
              }}
              size="large"
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDesktopDrawer}
              sx={{
                mr: 2,
                display: {
                  xs: 'none',
                  md: 'flex',
                },
              }}
              size="large"
            >
              {state.desktopDrawerIsOpen ? <MenuCloseIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap sx={{ mr: 'auto' }} onClick={openReleaseNotesDialog} style={{ cursor: 'pointer' }}>
              LiveLink 0.7 (release notes)
            </Typography>
            {/* ... other components ... */}
            <Hidden mdUp implementation="js">
              {/* ... other components ... */}
            </Hidden>
            <IconButton
              color="inherit"
              aria-label="User Manual"
              onClick={openUserManual}
              sx={{ mr: 2 }}
              size="large"
            >
              <HelpIcon />
              <Typography variant="body1" color="inherit" sx={{ marginLeft: 1 }}>
                User Manual
              </Typography>
            </IconButton>
            <ThemeSwitch checked={state.theme === 'dark'} onChange={toggleTheme} />
          </Box>
        </Toolbar>
      </AppBar>
      {/* Release Notes Dialog */}
      <Dialog open={releaseNotesDialogOpen} onClose={closeReleaseNotesDialog}>
      <DialogTitle>Release Notes</DialogTitle>
      <DialogContent sx={{ maxHeight: '80vh' }}>
      <DialogContentText sx={{ overflowY: 'auto' }}>
        v0.8 - 2024/02/06 
        <br />
        1. Results from the previous month and the following month are also displayed in the monthly query
        <br />
        2. Results are still displayed even if userIDs are not connected in an ego network query.
        <br />
        <br />
        v0.7 - 2024/02/05 
        <br />
        1. A grid overlay can be shown or hidden using the &quot;Show Grid&quot; checkbox.
        <br />
        2. Stop button is removed.
        <br />
        <br />
        v0.6 - 2024/01/30 
        <br />
        1. Download graphs as images.
        <br />
        2. New Edge type &quot;Paid coins&quot; is added.
        <br />
        3. Button UI is replaced.
        <br />
      </DialogContentText>
        
      </DialogContent>
    </Dialog>
    </>
  );
}
