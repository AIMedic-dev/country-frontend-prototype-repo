import React from 'react';
import '../styles/loadingmodal.css';

interface LoadingModalProps {
  show?: boolean;
  text?: string;
}

/**
 * Modal de carga (bloquea la pantalla completa)
 * @param show  - Controla la visibilidad
 * @param text  - Mensaje opcional (p. ej. “Creando cuenta…”)
 */
const LoadingModal: React.FC<LoadingModalProps> = ({ show = false, text = 'Cargando…' }) => {
    if (!show) return null;
    return (
      <div className="loading-overlay" role="alertdialog" aria-modal="true">
        <div className="loading-modal">
          <div className="loading-spinner" aria-hidden="true" />
          <p className="loading-text">{text}</p>
        </div>
      </div>
    );
  };
  
  export default LoadingModal;
