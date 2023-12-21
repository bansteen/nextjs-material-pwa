import { AppMenuItem } from 'components/sidebars'
import { getAuth, signOut } from 'firebase/auth'
export function DefaultMenuItems({
  onClick
}: {
  onClick?: (...args: any[]) => void
}) {
  const auth = getAuth();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // You can redirect the user to another page after successful logout if needed
      // For example: router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  return (
    <>
      {/* <AppMenuItem link={{ href: '/app' }} onClick={onClick}>
        Community Structure
      </AppMenuItem> */}
      <AppMenuItem link={{ href: '/app' }} onClick={onClick}>
        Connection Explorer
      </AppMenuItem>
      <AppMenuItem link={{ href: '/' }} onClick={handleLogout}>
        Logout
      </AppMenuItem>
    </>
  )
}
