import AccountBoxIcon from '@mui/icons-material/AccountBox'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { SettingsProfile, ShellTitle } from 'components'
import { AppLayout } from 'components/layout'
import { MobileMenuItem } from 'components/sidebars'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

export default function Settings() {
  const router = useRouter()

  return (
    <>
      <Paper>
        <Box m={2} pt={2} pb={2}>
          <Typography variant="h6">Change in connection</Typography>
        </Box>
      </Paper>
      {router.query.section === 'profile' ? (
        <SettingsProfile />
      ) : (
        <MainContent />
      )}
    </>
  )
}

function MainContent() {
  return (
    <>
      <ShellTitle title="Change in connection" />
    </>
  )
}

Settings.layout = AppLayout

Settings.desktopSidebar = function SettingsMenuDesktop(
  defaultItems: ReactNode
) {
  return (
    <>
      <List>{defaultItems}</List>
      <Divider />
      <List>
        <MobileMenuItem
          icon={
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
          }
          link={{ href: '/app/settings?section=profile', shallow: true }}
        >
          Profile
        </MobileMenuItem>
      </List>
    </>
  )
}

Settings.mobileSidebar = function SettingsMenuMobile(defaultItems: ReactNode) {
  return (
    <>
      <List>{defaultItems}</List>
      <Divider />
    </>
  )
}
