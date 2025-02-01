import Image from 'next/image';
const NavBar = () => {
  return (
    <nav className="flex w-full items-center pr-4 pl-4 pt-2 pb-2 space-x-2">
      {/* <span className="material-icons cursor-pointer bg-blue-2/50 text-blue-3 p-0.5s rounded-full">
        menu
      </span> */}
      <Image
        src="/logos/aimedic-logo-blanco.svg"
        alt="logo aimedic"
        width={100}
        height={100}
        className="w-36 sm:w-48 "
      />
      <div className="flex w-full items-center justify-end space-x-2">
        <span className="text-lg">
          ¡Bienvenido <span className="text-blue-3">usuario</span>!
        </span>
        <span
          style={{
            fontSize: '30px',
          }}
          className="material-icons text-blue-3 bg-blue-2/50 rounded-full p-1"
        >
          person
        </span>
      </div>
    </nav>
  );
};

export default NavBar;
