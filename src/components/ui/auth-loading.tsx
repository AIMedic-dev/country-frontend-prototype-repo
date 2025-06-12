import { Lock, LogOut } from 'lucide-react';

interface AuthLoadingProps {
  type: 'login' | 'logout';
}

const AuthLoading = ({ type }: AuthLoadingProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-8">
        {/* Loading Animation */}
        <div className="relative">
          {/* Círculo exterior giratorio */}
          <div className="absolute -inset-2 border-4 border-blue-500/20 rounded-full animate-[spin_3s_linear_infinite]"></div>
          <div className="absolute -inset-2 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-[spin_2s_linear_infinite]"></div>

          {/* Círculo interior con gradiente */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-25 animate-pulse"></div>

          {/* Contenedor central */}
          <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg">
            {type === 'login' ? (
              <Lock className="w-8 h-8 text-blue-500 animate-pulse" />
            ) : (
              <LogOut className="w-8 h-8 text-blue-500 animate-pulse" />
            )}
          </div>

          {/* Puntos decorativos */}
          <div className="absolute -right-2 -top-2 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-75"></div>
          <div className="absolute -left-2 -bottom-2 w-3 h-3 bg-purple-500 rounded-full animate-ping opacity-75 [animation-delay:-0.5s]"></div>
        </div>

        {/* Mensaje */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {type === 'login' ? 'Verificando acceso...' : 'Cerrando sesión...'}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {type === 'login'
              ? 'Estamos validando tus credenciales'
              : 'Espera mientras cerramos tu sesión'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLoading;
