import { useState, useEffect } from 'react';
import { Construction, X, Wrench, Zap } from 'lucide-react';

const ConstructionFloat = ({
  isVisible = true,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const [show, setShow] = useState(isVisible);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      setTimeout(() => setAnimate(true), 100);
    }
  }, [isVisible]);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => {
      setShow(false);
      onClose?.();
    }, 300);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay con blur */}
      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          animate ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Contenedor flotante */}
      <div
        className={`relative transform transition-all duration-500 ${
          animate
            ? 'scale-100 opacity-100 translate-y-0'
            : 'scale-90 opacity-0 translate-y-8'
        }`}
      >
        {/* Efectos de resplandor */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-30 scale-110 animate-pulse"></div>
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-3xl blur-lg opacity-20 scale-105 animate-pulse"
          style={{ animationDelay: '0.5s' }}
        ></div>

        {/* Contenedor principal */}
        <div className="relative bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 rounded-3xl p-8 shadow-2xl max-w-md w-full border border-white/20 backdrop-blur-sm overflow-hidden group transition-all duration-300">
          {/* Efecto de brillo que se mueve */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>

          {/* Botón de cerrar */}
          <button
            onClick={handleClose}
            className="absolute cursor-pointer top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 backdrop-blur-sm border border-gray-300/30"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          {/* Contenido principal */}
          <div className="relative z-10 text-center">
            {/* Iconos animados */}
            <div className="flex items-center justify-center mb-6 space-x-2">
              {/* Icono principal con efectos */}
              <div className="relative">
                {/* Anillo rotatorio */}
                <div
                  className="absolute inset-0 w-12 h-12 border-4 border-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 rounded-2xl opacity-50 animate-spin"
                  style={{ animationDuration: '3s' }}
                ></div>

                {/* Contenedor del icono */}
                <div
                  className="w-12 h-12 bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:rotate-3 transition-all duration-300 relative overflow-hidden border-2 border-white/30 animate-bounce"
                  style={{ animationDuration: '2s' }}
                >
                  <Construction className="w-7 h-7 text-white drop-shadow-lg" />
                </div>

                {/* Indicadores de actividad */}
                <div className="absolute -top-2 -right-2">
                  <div className="w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Iconos secundarios flotantes */}
              <div className="flex flex-col space-y-2">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg animate-pulse transform hover:scale-110 transition-transform">
                  <Wrench className="w-4 h-4 text-white" />
                </div>
                <div
                  className="w-8 h-8 bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg animate-pulse transform hover:scale-110 transition-transform"
                  style={{ animationDelay: '0.5s' }}
                >
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Título */}
            <h3 className="text-2xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text">
              ¡En Construcción!
            </h3>

            {/* Descripción */}
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Esta funcionalidad aún se está construyendo. Nuestro equipo está
              trabajando para traerte una experiencia increíble.
            </p>

            {/* Barra de progreso animada */}
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
              <div
                className="absolute inset-0 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 rounded-full animate-progress"
                style={{
                  transform: 'translateX(0%)',
                  width: '75%',
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 animate-pulse"></div>
            </div>

            {/* Botón de acción */}
            <button
              onClick={handleClose}
              className="relative bg-gradient-to-br cursor-pointer from-violet-600 via-blue-600 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-white/20 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
              <span className="relative z-10">Entendido</span>
            </button>

            {/* Texto adicional */}
            <p className="text-xs text-gray-500 mt-4 opacity-70">
              ¡Mantente al tanto de las actualizaciones!
            </p>
          </div>

          {/* Decoraciones adicionales */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-violet-400 rounded-full animate-ping"></div>
          <div
            className="absolute bottom-4 right-16 w-1 h-1 bg-blue-400 rounded-full animate-ping"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute top-1/2 left-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping"
            style={{ animationDelay: '1.5s' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ConstructionFloat;
