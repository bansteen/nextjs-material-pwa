import { AppMenuItem } from 'components/sidebars'

export function DefaultMenuItems({
  onClick
}: {
  onClick?: (...args: any[]) => void
}) {
  return (
    <>
      {/* <AppMenuItem link={{ href: '/app' }} onClick={onClick}>
        Community Structure
      </AppMenuItem> */}
      <AppMenuItem link={{ href: '/app' }} onClick={onClick}>
        Connection Explorer
      </AppMenuItem>
      {/* <AppMenuItem link={{ href: '/onboarding' }} onClick={onClick}>
        Onboarding
      </AppMenuItem> */}
    </>
  )
}
