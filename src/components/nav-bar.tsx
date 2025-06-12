import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { User, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from './context/auth-context';

interface NavBarProps {
  isSidebarOpen: boolean;
  isLoading: boolean;
  className?: string;
  userProfileClassName?: string;
}

const NavBar = ({ userProfileClassName = '' }: NavBarProps) => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // No cerrar si el clic fue en el dropdown o en el botón del perfil
      if (
        target.closest('.profile-dropdown') ||
        target.closest('.profile-button')
      )
        return;

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (profileRef.current) {
      const rect = profileRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isProfileOpen]);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          {/* Left side - Empty for now */}
          <div className="flex items-center"></div>

          {/* Right side - Logos and Profile */}
          <div className="flex items-center space-x-6">
            {/* Logos */}
            <div className="flex items-center space-x-6">
              {/* AIMedic Logo */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-blue-500/40 rounded-lg blur-sm opacity-80 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative p-1.5 rounded-lg bg-white/10 dark:bg-gray-800/10 backdrop-blur-[2px]">
                  <img
                    src="/images/logos/aimedic-logo-blanco.svg"
                    alt="AIMedic"
                    className="h-6 w-auto transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 brightness-0 dark:brightness-100"
                  />
                </div>
              </div>

              {/* Separator */}
              <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-300/30 dark:via-gray-600/30 to-transparent"></div>

              {/* Country Logo */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-blue-500/40 rounded-lg blur-sm opacity-80 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative p-1.5 rounded-lg bg-white/10 dark:bg-gray-800/10 backdrop-blur-[2px]">
                  <img
                    src="/images/logos/clinica-del-country-logo-blanco.png"
                    alt="Country"
                    className="h-6 w-auto transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 brightness-0 dark:brightness-100"
                  />
                </div>
              </div>
            </div>

            {/* Profile Button */}
            <div
              className={`relative cursor-pointer ${userProfileClassName}`}
              ref={profileRef}
            >
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="profile-button group flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 hover:from-blue-50/90 hover:via-blue-50/80 hover:to-blue-50/70 dark:hover:from-blue-900/20 dark:hover:via-blue-900/15 dark:hover:to-blue-900/10 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-200/50 dark:hover:border-blue-700/50 transition-all duration-500"
              >
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
                  {/* Avatar container */}
                  <div className="relative w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 flex items-center justify-center ring-2 ring-white/50 dark:ring-gray-800/50 group-hover:ring-blue-200/50 dark:group-hover:ring-blue-700/50 transition-all duration-500">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-spin-slow"></div>
                    <User className="w-3.5 h-3.5 text-white drop-shadow-sm" />
                  </div>
                  {/* Online indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-white dark:border-gray-800 rounded-full shadow-sm">
                    <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 transition-all duration-500">
                    {user?.userName || 'Usuario'}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-all duration-500 ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Dropdown */}
      {isProfileOpen &&
        createPortal(
          <div
            className="profile-dropdown fixed w-48 rounded-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-700/50 py-1 z-[99999]"
            style={{
              top: `${buttonPosition.top}px`,
              right: `${buttonPosition.right}px`,
            }}
          >
            <div className="px-4 py-2 border-b border-gray-200/50 dark:border-gray-700/50">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user?.userName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
            <button
              onClick={() => {
                logout();
              }}
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>,
          document.body
        )}
    </nav>
  );
};

export default NavBar;
