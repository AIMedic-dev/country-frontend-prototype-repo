import { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import ConstructionFloat from '../construction-float';

const LoginUi = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConstruction, setShowConstruction] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simular carga
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-4">
      {/* Contenedor principal */}
      <div className="w-full max-w-md">
        <div className="relative group">
          {/* Efecto de sombra dinámica */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-all duration-300"></div>

          {/* Contenedor de la tarjeta */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 overflow-hidden">
            {/* Efecto de brillo que se mueve */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>

            {/* Efecto de borde brillante */}
            <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 rounded-3xl bg-white/80 backdrop-blur-sm"></div>
            </div>

            {/* Contenido */}
            <div className="relative">
              {/* Logo y título con efectos mejorados */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-6 mb-4">
                  {/* Logo AIMedic */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-blue-500/40 rounded-lg blur-sm opacity-80 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative p-1.5 rounded-lg bg-white/10 backdrop-blur-[2px]">
                      {/* Cuadrado giratorio */}
                      <div
                        className="absolute -inset-2 w-8 h-8 border-2 border-blue-500/30 rounded-lg animate-spin"
                        style={{ animationDuration: '3s' }}
                      ></div>
                      <img
                        src="/images/logos/aimedic-logo-blanco.svg"
                        alt="AIMedic"
                        className="h-6 w-auto transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 brightness-0 dark:brightness-100 relative z-10"
                      />
                      {/* Efecto de brillo */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-300/30 to-transparent"></div>

                  {/* Logo Country */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-blue-500/40 rounded-lg blur-sm opacity-80 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative p-1.5 rounded-lg bg-white/10 backdrop-blur-[2px]">
                      <img
                        src="/images/logos/clinica-del-country-logo-blanco.png"
                        alt="Country"
                        className="h-6 w-auto transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 brightness-0 dark:brightness-100 relative z-10"
                      />
                      {/* Efecto de brillo */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-blue-900">
                    Bienvenido
                  </h1>
                  <p className="text-blue-800/80 text-sm">
                    Ingresa tus credenciales para continuar
                  </p>
                </div>
              </div>

              {/* Formulario con estilos mejorados */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campo de email con efectos mejorados */}
                <div className="space-y-1.5 group/input">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-blue-900 group-hover/input:text-blue-700 transition-colors duration-300"
                  >
                    Correo electrónico
                  </label>
                  <div className="relative group/field">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <div className="p-1.5 rounded-lg bg-blue-50 group-hover/field:bg-blue-100 transition-colors duration-300">
                        <User className="h-4 w-4 text-blue-900/70 group-hover/field:text-blue-700 transition-colors duration-300" />
                      </div>
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="block w-full pl-14 pr-4 py-3 border-2 border-blue-100 rounded-xl bg-white/50 text-blue-900 placeholder-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 hover:border-blue-200 group-hover/field:shadow-sm group-hover/field:shadow-blue-500/5"
                      placeholder="tu@email.com"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50/0 via-blue-50/0 to-blue-50/0 group-hover/field:from-blue-50/30 group-hover/field:via-blue-50/20 group-hover/field:to-blue-50/30 transition-all duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Campo de contraseña con efectos mejorados */}
                <div className="space-y-1.5 group/input">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-blue-900 group-hover/input:text-blue-700 transition-colors duration-300"
                  >
                    Contraseña
                  </label>
                  <div className="relative group/field">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <div className="p-1.5 rounded-lg bg-blue-50 group-hover/field:bg-blue-100 transition-colors duration-300">
                        <Lock className="h-4 w-4 text-blue-900/70 group-hover/field:text-blue-700 transition-colors duration-300" />
                      </div>
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="block w-full pl-14 pr-12 py-3 border-2 border-blue-100 rounded-xl bg-white/50 text-blue-900 placeholder-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 hover:border-blue-200 group-hover/field:shadow-sm group-hover/field:shadow-blue-500/5"
                      placeholder="••••••••"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50/0 via-blue-50/0 to-blue-50/0 group-hover/field:from-blue-50/30 group-hover/field:via-blue-50/20 group-hover/field:to-blue-50/30 transition-all duration-300 pointer-events-none"></div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <div className="p-1.5 rounded-lg bg-blue-50 group-hover/field:bg-blue-100 transition-colors duration-300">
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-blue-900/70 hover:text-blue-700 transition-colors" />
                        ) : (
                          <Eye className="h-4 w-4 text-blue-900/70 hover:text-blue-700 transition-colors" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Botón de inicio de sesión con efectos mejorados */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative bg-gradient-to-br cursor-pointer from-violet-600 via-blue-600 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-white/20 overflow-hidden group w-full mt-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                  <span className="relative z-10">
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="animate-pulse">
                          Iniciando sesión...
                        </span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center">
                        <LogIn className="w-5 h-5 mr-2 transition-all duration-300 group-hover:translate-x-1 group-hover:rotate-12" />
                        Iniciar sesión
                      </span>
                    )}
                  </span>
                </button>
              </form>

              {/* Enlaces adicionales con efectos mejorados */}
              <div className="mt-4 text-center space-y-3">
                <button
                  onClick={() => setShowConstruction(true)}
                  className="text-sm text-blue-900/80 hover:text-blue-700 transition-colors relative group"
                >
                  ¿Olvidaste tu contraseña?
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </button>
                <p className="text-sm text-blue-900/80">
                  ¿No tienes una cuenta?{' '}
                  <button
                    onClick={() => setShowConstruction(true)}
                    className="text-blue-700 hover:text-blue-800 transition-colors relative group"
                  >
                    Regístrate
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Construction Float */}
      <ConstructionFloat
        isVisible={showConstruction}
        onClose={() => setShowConstruction(false)}
      />
    </div>
  );
};

export default LoginUi;
