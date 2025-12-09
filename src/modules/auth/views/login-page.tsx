import { useEffect, useState } from 'react';
import { Input } from '../components/input/Input';
import { Button } from '../components/button/Button';
import { TermsModal } from '../components/TermsModal/TermsModal';
import '../styles/login.css';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function Login() {
  const [code, setCode] = useState('');
  const [remember, setRemember] = useState(false);
  const [accept, setAccept] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [termsModalSection, setTermsModalSection] = useState<string | undefined>(undefined);

  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, user } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Si es empleado, redirigir a analytics; si es paciente, a dashboard
      if (user.rol === 'empleado') {
        navigate('/analytics', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accept) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }

    if (!code.trim()) {
      alert('Por favor ingresa tu código');
      return;
    }

    const response = await login(code.trim());

    if (response) {
      // Redirigir según el rol del usuario
      if (response.user.rol === 'empleado') {
        navigate('/analytics', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  };

  return (
    <div className="login-wrapper">
      {/* PANEL IZQUIERDO - Imagen completa */}
      <section className="left-panel">
        <div className="left-image-container">
          <img
            src="images/foto-login-aprobada1.jpg"
            alt="Clínica del Country - Centro de Oncología"
            className="left-background-image"
          />
        </div>
      </section>

      {/* PANEL DERECHO - Formulario */}
      <section className="right-panel">
        {/* Logo de Country - Solo visible en móviles */}
        <div className="country-logo-mobile">
          <img
            src="images/logos/country-logo (1).png"
            alt="Clínica del Country"
            className="country-logo-img"
          />
        </div>

        {/* Contenido centrado */}
        <div className="right-stack">
          <header className="right-hero">
            <h1 className="right-hero-title">Bienvenido</h1>
            <p className="right-hero-subtitle">
              Contamos con los mejores servicios de cada especialidad
            </p>
          </header>

          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Iniciar sesión</h2>

            <Input
              label="Código de ingreso"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ej: CTRY-9F42-ABCD"
            />

            {error && (
              <div className="form-error" style={{
                color: '#ef4444',
                fontSize: '0.875rem',
                marginTop: '-0.5rem'
              }}>
                {error}
              </div>
            )}

            <div className="form-checks">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Recuérdame</span>
              </label>

              <label className="checkbox terms">
                <input
                  type="checkbox"
                  checked={accept}
                  onChange={(e) => setAccept(e.target.checked)}
                />
                <span>
                  He leído y acepto los{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setTermsModalSection(undefined);
                      setIsTermsModalOpen(true);
                    }}
                    style={{ color: 'var(--ds-blue-600)', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Términos y Condiciones
                  </a>{' '}
                  &{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setTermsModalSection('CAPITULO-IV');
                      setIsTermsModalOpen(true);
                    }}
                    style={{ color: 'var(--ds-blue-600)', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Autorización de datos personales
                  </a>
                </span>
              </label>
            </div>

            <Button
              type="submit"
              text={isLoading ? 'Ingresando...' : 'Ingresar'}
              disabled={isLoading || !accept}
            />
            <p className="secure-note">Conexión segura · Datos protegidos</p>
          </form>

          {/* Logo de AIMEDIC debajo del formulario */}
          <div className="brand-footer">
            <img
              className="brand-logo-footer"
              src="images/logos/amedic-oscuro.svg"
              alt="AIMEDIC"
            />
          </div>
        </div>
      </section>

      {/* Modal de Términos y Condiciones */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        scrollToSection={termsModalSection}
      />
    </div>
  );
}
