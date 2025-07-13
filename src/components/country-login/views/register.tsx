import { useState } from 'react';
import { Input } from '../components/input';
import { Button } from '../components/button';
import { sendVerificationCode } from '../services/serviceAuthCode';
import { useFormValidation } from '../hooks/useFormValidation';
import '../styles/login.css';
import LoadingModal from '../components/LoadingModal';

type Props = {
  navigate: (path: 'login' | 'register' | 'verify' | 'registerPatient') => void;
  setTempUser: (data: { email: string; name: string; password: string }) => void;
};

export default function Register({ navigate, setTempUser }: Props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');      // 👈 nuevo estado
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    validateRequired,
    validatePassword,
    validateEmail,
    setFieldError,
    validation,
    clearErrors,
  } = useFormValidation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setError('');

    const nameError = validateRequired(name, 'Nombre');
    const emailError = validateEmail(email, 'doctor');
    const passwordError = validatePassword(password);
    const confirmPasswordError =
      password !== confirmPassword ? 'Las contraseñas no coinciden' : '';

    setFieldError('name', nameError);
    setFieldError('email', emailError);
    setFieldError('password', passwordError);
    setFieldError('confirmPassword', confirmPasswordError);         // 👈 guardar error simple

    if (nameError || emailError || passwordError || confirmPasswordError) return;

    setIsSubmitting(true);

    try {
      await sendVerificationCode(email);

      setTempUser({ email, name, password });
      navigate('verify');
    } catch (err) {
      setError('No se pudo enviar el código.');
    } finally {
      setIsSubmitting(false); // 🔴 Ocultar modal
    }
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="left-panel">
          <h1 className="left-title">Crear cuenta</h1>
          <p className="left-subtitle">Usa tu correo corporativo para registrarte</p>
        </div>

        <div className="right-panel">
          <form onSubmit={handleRegister} className="login-form">
            <h2 className="form-title">Registro</h2>

            <Input
              label="Nombre completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Pérez"
              error={validation.errors.name}
            />

            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@clinicadelcountry.com"
              error={validation.errors.email}
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              error={validation.errors.password}
            />

            {/* 👇 nuevo campo para confirmar contraseña */}
            <Input
              label="Confirmar contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              error={validation.errors.confirmPassword}
            />

            {error && <p className="form-error-message">{error}</p>}

            <Button type="submit" text="Enviar código" />

            <p className="form-footer-link">
              ¿Ya tienes cuenta?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('login');
                }}
              >
                Inicia sesión
              </a>
            </p>
          </form>
        </div>
      </div>
      <LoadingModal show={isSubmitting} text="Enviado Codigo…" />
    </>

  );
}
