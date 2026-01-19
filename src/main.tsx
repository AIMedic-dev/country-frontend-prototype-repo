import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import './index.css';
import App from './App.tsx';
import HotjarInit from './HotjarInit';
import { ErrorBoundary } from './shared/components/ErrorBoundary/ErrorBoundary';

// Verificar que el root existe
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ Root element not found');
  document.body.innerHTML = '<div style="padding: 2rem; text-align: center;"><h1>Error: Root element not found</h1></div>';
  throw new Error('Root element not found');
}

// Manejar errores no capturados
window.addEventListener('error', (event) => {
  console.error('❌ Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
});

try {
  console.log('🚀 Starting application...');
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <HotjarInit />
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
  console.log('✅ Application rendered successfully');
} catch (error) {
  console.error('❌ Error rendering application:', error);
  rootElement.innerHTML = `
    <div style="padding: 2rem; text-align: center; font-family: system-ui;">
      <h1 style="color: #dc2626;">Error al cargar la aplicación</h1>
      <p style="color: #64748b;">${error instanceof Error ? error.message : 'Error desconocido'}</p>
      <button onclick="window.location.reload()" style="padding: 0.75rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 1rem;">
        Recargar página
      </button>
    </div>
  `;
}
