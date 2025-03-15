'use client';
import Image from 'next/image';
import { isMobile as detectedMobile } from 'react-device-detect';
import { useEffect, useState } from 'react';
import SideMenu from '@/app/components/side-menu';

import { getTokenFromCookie, decodeToken } from '@/resources/functions';

const NavBar = () => {
  // estado para verificar si el usuario está en un dispositivo móvil
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  // estado para guardar el nombre del usuario
  const [userName, setUserName] = useState<string>('');
  // estado para mostrar u ocultar el menú lateral
  const [showMenu, setShowMenu] = useState(false);
  // estado para mostrar u ocultar el chat flotante en móvil
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    setIsMobile(detectedMobile);
    const token = getTokenFromCookie();
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        const user = decodedToken.userName;
        user ? setUserName(user) : setUserName('Invitado');
      }
    } else {
      setUserName('Invitado');
    }
  }, []);

  return (
    <>
      {showChat && (
        <>
          {/* contenedor que representa el fondo blanco del chat en móvil */}
          <div className="bg-white-1/50 backdrop-blur-md w-full h-full fixed top-0 left-0"></div>
        </>
      )}
      {/* contenedor que representa la barra de navegación */}
      <nav className="flex w-full items-center h-12 sm:h-14  px-4 py-4">
        <span
          onClick={() => setShowMenu(!showMenu)}
          style={{
            fontSize: '24px',
          }}
          className={`material-icons w-fit cursor-pointer ${
            showMenu && 'z-30'
          } bg-blue-2/50 hover:bg-blue-2/40 text-blue-3 p-1.5 rounded-full sm:mr-3 `}
        >
          {showMenu ? 'menu_open' : 'menu'}
        </span>

        {/* contenedor que representa los logos empresariales */}
        <div className="hidden sm:flex items-center space-x-3  ">
          <Image
            src="/logos/aimedic-logo-blanco.svg"
            alt="logo aimedic"
            width={100}
            height={100}
            className="w-40 sm:w-36"
          />

          <Image
            src="/logos/clinica-del-country-logo-blanco.png"
            alt="clinica del country logo"
            width={100}
            height={20}
            className="w-25 "
          />
        </div>

        <div className=" lg:hidden mr-5 ml-auto"></div>

        <span className="text-lg mr-2 sm:text-base 2xl:text-lg whitespace-nowrap sm:ml-auto">
          ¡Bienvenido <span className="text-blue-3">{userName}</span>!
        </span>
        <span
          style={{
            fontSize: isMobile ? '30px' : '24px',
          }}
          className="material-icons text-blue-3 bg-blue-2/50 rounded-full p-1"
        >
          person
        </span>
      </nav>
      <div className=" pl-4 pr-4 w-full mr-auto flex sm:hidden space-x-3  items-center">
        {/* contenedor para colocar en fila los logos y alinearlos con items-end */}

        <Image
          src="/logos/aimedic-logo-blanco.svg"
          alt="logo aimedic"
          width={100}
          height={100}
          className="w-32"
        />

        <Image
          src="/logos/clinica-del-country-logo-blanco.png"
          alt="clinica del country logo"
          width={100}
          height={20}
          className="w-25 "
        />
      </div>
      <SideMenu setShowMenu={setShowMenu} showMenu={showMenu} />
    </>
  );
};

export default NavBar;
