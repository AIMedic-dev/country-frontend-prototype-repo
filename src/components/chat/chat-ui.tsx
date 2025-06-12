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

// Componente de error para fallos del módulo
const ChatError = () => (
  <div className="flex flex-col items-center justify-center h-full p-8">
    <div className="text-center space-y-4">
      <MessageSquare className="w-16 h-16 text-gray-400 mx-auto" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Chat no disponible
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        El módulo de chat no pudo cargarse. Por favor, recarga la página.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Recargar página
      </button>
    </div>
  </div>
);

// Función helper para asegurar URL
const ensureURLConstructor = () => {
  if (typeof window !== 'undefined') {
    const originalURL = window.URL || (window as any).webkitURL;
    if (originalURL) {
      (globalThis as any).URL = originalURL;
      (window as any).URL = originalURL;
      return true;
    }
  }
  return false;
};

const ChatMicroservice = lazy(() => {
  // Asegurar URL antes de importar
  ensureURLConstructor();

  return import('chat_microservice/chat-country')
    .then(module => {
      console.log('✅ Módulo chat cargado exitosamente');
      return module;
    })
    .catch(error => {
      console.error('❌ Error al cargar el módulo del chat:', error);

      // Si es error de URL, reintentar una vez
      if (error.message.includes('URL is not a constructor')) {
        console.log('🔄 Reintentando carga del módulo...');
        ensureURLConstructor();

        return import('chat_microservice/chat-country')
          .then(module => {
            console.log('✅ Módulo chat cargado exitosamente en reintento');
            return module;
          })
          .catch(retryError => {
            console.error('❌ Error en reintento:', retryError);
            return { default: ChatError };
          });
      }

      return { default: ChatError };
    });
});

const ChatUI = () => {
  const [moduleLoadAttempted, setModuleLoadAttempted] = useState(false);

  // Marcar que se intentó cargar el módulo
  useEffect(() => {
    setModuleLoadAttempted(true);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-none relative z-0">
        <NavBar
          isLoading={!moduleLoadAttempted}
          className="pointer-events-auto"
          userProfileClassName="pointer-events-auto"
        />
      </div>
      <main className="flex-1 overflow-hidden relative z-10">
        <Suspense fallback={<ChatLoading />}>
          <div className="h-full">
            <ChatMicroservice />
          </div>
        </Suspense>
      </main>
    </div>
  );
};

export default ChatUI;
