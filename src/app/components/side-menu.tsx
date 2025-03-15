'use client';
import { SideMenuProps } from '@/resources/types/props';
import ItemSideMenu from '@/app/components/item-side-menu';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/components/auth-context';
import { useRouter } from 'next/navigation';

const SideMenu: React.FC<SideMenuProps> = ({ setShowMenu, showMenu }) => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleClick = (path: string) => {
    if (pathname !== '/chat' && pathname !== '/' && path === 'chat') {
      router.push('/chat');
      setShowMenu(false);
    }

    if (path === 'logout') {
      logout();
    }
  };
  return (
    <>
      {/* contenedor que representa el fondo cuando se despliega el menú lateral */}
      <div
        onClick={() => setShowMenu(false)}
        className={`fixed h-full ${
          showMenu
            ? 'w-full bg-white-1/50 backdrop-blur-md'
            : 'w-0 bg-transparent'
        }  top-0 left-0 z-20 transition-colors duration-300`}
      ></div>

      {/* menú lateral */}
      <aside
        onClick={e => e.stopPropagation()}
        className={`fixed top-0 left-0 h-[100dvh] shadow-layout rounded-r-3xl  transition-all duration-300 ${
          showMenu
            ? 'border-b border-t border-r border-blue-3 z-20 w-7/12 sm:w-2/5 md:w-2/6 lg:w-1/4 xl:w-1/5 bg-blue-1/70'
            : 'w-0'
        } `}
      >
        {/* ítems del menú lateral */}
        {showMenu && (
          <>
            <div className="flex flex-col items-center justify-center h-[70%] w-full space-y-3">
              <ItemSideMenu
                title="Chat"
                selected={pathname === '/chat' || pathname === '/'}
                iconName="chat"
                onClick={() => handleClick('chat')}
              />
            </div>

            <div className="flex flex-col items-center justify-center h-[30%] w-full">
              <ItemSideMenu
                title="Salir"
                selected={false}
                iconName="logout"
                onClick={() => {
                  logout();
                }}
              />
            </div>
          </>
        )}
      </aside>
    </>
  );
};
export default SideMenu;
