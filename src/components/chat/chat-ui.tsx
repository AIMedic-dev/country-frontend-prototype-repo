import { Suspense, lazy, useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import NavBar from '../nav-bar';

const ChatLoading = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-8">
        {/* Logos */}
        <div className="flex items-center space-x-8 bg-white/5 dark:bg-gray-900/5 backdrop-blur-[2px] rounded-2xl shadow-lg shadow-black/5 px-4">
          {/* Logo AIMedic */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg opacity-100 transition-all duration-300"></div>
            <div className="relative p-2 rounded-lg">
              <img
                src="/images/logos/aimedic-logo-blanco.svg"
                alt="AIMedic"
                className="h-7 w-auto transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 brightness-0 dark:brightness-100"
              />
            </div>
          </div>

          {/* Separador con gradiente */}
          <div className="h-7 w-px bg-gradient-to-b from-transparent via-gray-300/20 dark:via-gray-600/20 to-transparent"></div>

          {/* Logo Country */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg opacity-100 transition-all duration-300"></div>
            <div className="relative p-2 rounded-lg">
              <img
                src="/images/logos/clinica-del-country-logo-blanco.png"
                alt="Country"
                className="h-7 w-auto transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 brightness-0 dark:brightness-100"
              />
            </div>
          </div>
        </div>

        {/* Loading animation */}
        <div className="relative">
          {/* Círculo exterior giratorio */}
          <div className="absolute -inset-2 border-4 border-blue-500/20 rounded-full animate-[spin_3s_linear_infinite]"></div>
          <div className="absolute -inset-2 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-[spin_2s_linear_infinite]"></div>

          {/* Círculo interior con gradiente */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-25 animate-pulse"></div>

          {/* Contenedor central */}
          <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg">
            <MessageSquare className="w-8 h-8 text-blue-500 animate-pulse" />
          </div>

          {/* Puntos decorativos */}
          <div className="absolute -right-2 -top-2 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-75"></div>
          <div className="absolute -left-2 -bottom-2 w-3 h-3 bg-purple-500 rounded-full animate-ping opacity-75 [animation-delay:-0.5s]"></div>
        </div>
      </div>
    </div>
  );
};

// Importación del módulo federado
const ChatMicroservice = lazy(() =>
  import('chat_microservice/chat-country').catch(() => {
    console.error('Error al cargar el módulo del chat');
    return { default: () => <ChatLoading /> };
  })
);

const ChatUI = () => {
  const [isModuleLoaded, setIsModuleLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkModule = async () => {
      try {
        await import('chat_microservice/chat-country');
        setIsModuleLoaded(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al verificar el módulo:', error);
        setIsModuleLoaded(false);
        setIsLoading(false);
      }
    };

    checkModule();
  }, []);

  // Escuchar el evento de cambio del sidebar
  useEffect(() => {
    const handleSidebarChange = (event: CustomEvent) => {
      setIsSidebarOpen(event.detail.isOpen);
    };

    window.addEventListener(
      'sidebarChange',
      handleSidebarChange as EventListener
    );
    return () => {
      window.removeEventListener(
        'sidebarChange',
        handleSidebarChange as EventListener
      );
    };
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-none relative z-0">
        <NavBar
          isSidebarOpen={isSidebarOpen}
          isLoading={isLoading}
          className="pointer-events-auto"
          userProfileClassName="pointer-events-auto"
        />
      </div>
      <main className="flex-1 overflow-hidden relative z-10">
        <Suspense fallback={<ChatLoading />}>
          {isModuleLoaded ? (
            <div className="h-full">
              <ChatMicroservice />
            </div>
          ) : (
            <ChatLoading />
          )}
        </Suspense>
      </main>
    </div>
  );
};

export default ChatUI;
