import { AppMenuItem } from 'components/sidebars'

export function DefaultMenuItems({
  onClick
}: {
  onClick?: (...args: any[]) => void
}) {
  return (
    <>
      <AppMenuItem link={{ href: '/app' }} onClick={onClick}>
        Community Structure
      </AppMenuItem>
      <AppMenuItem link={{ href: '/app/page2' }} onClick={onClick}>
        Change in connections
      </AppMenuItem>
      {/* <AppMenuItem link={{ href: '/onboarding' }} onClick={onClick}>
        Onboarding
      </AppMenuItem> */}
    </>
  )
}
