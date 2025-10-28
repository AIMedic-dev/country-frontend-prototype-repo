import { useEffect, useState } from 'react';
import { Input } from '../components/input/Input';
import { Button } from '../components/button/Button';
import '../styles/login.css';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function Login() {
  const [code, setCode] = useState('');
  const [remember, setRemember] = useState(false);
  const [accept, setAccept] = useState(false);

  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="login-wrapper">
      {/* PANEL IZQUIERDO - Imagen completa */}
      <section className="left-panel">
        <div className="left-image-container">
          <img
            src="images/imagen-completa2.jpg"
            alt="Clínica del Country - Centro de Oncología"
            className="left-background-image"
          />
        </div>
      </section>

      {/* PANEL DERECHO - Formulario */}
      <section className="right-panel">
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
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Términos y Condiciones
                  </a>{' '}
                  &{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>
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
    </div>
  );
}
