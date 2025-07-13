import { useState } from 'react';
import { loginUser } from '../services/graphql-request';                    // corporativo
import { loginPatient } from '../services/patient/graphql-request-patient'; // pacientes
import { fetchPatientStatus } from '../services/patient/graphql-patient';   // consulta status

import { Input } from '../components/input';
import { Button } from '../components/button';
import { useFormValidation } from '../hooks/useFormValidation';
import LoadingModal from '../components/LoadingModal';

import '../styles/login.css';
import { saveTokenToCookie } from '../../../lib/cookies-managment';

type Props = {
    navigate: (path: 'login' | 'register' | 'verify' | 'registerPatient') => void;
};

export default function Login({ navigate }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        validateEmail,
        validatePassword,
        setFieldError,
        validation,
        clearErrors,
    } = useFormValidation();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        setError('');

        const emailError = validateEmail(email, 'patient');
        const passwordError = validatePassword(password);

        setFieldError('email', emailError);
        setFieldError('password', passwordError);
        if (emailError || passwordError) return;

        setIsSubmitting(true);

        try {
            const isClinicEmail = email
                .toLowerCase()
                .endsWith('@clinicadelcountry.com');

            /** 1) Autenticación según dominio */
            const auth = isClinicEmail
                ? await loginUser({ email, password })      // backend corporativo
                : await loginPatient({ email, password });  // backend pacientes

            /** 2) Guardar token para que Apollo lo envíe en peticiones siguientes */
            saveTokenToCookie(auth.access_token);

            /** 3) Flujo corporativo */
            if (isClinicEmail) {
                window.dispatchEvent(
                    new CustomEvent('login-success', {
                        detail: { token: auth.access_token, redirectTo: '/' },
                    }),
                );
                return; // fin
            }

            /** 4) Flujo paciente */
            const { status } = await fetchPatientStatus(email); // requiere Authorization

            if (status === 'INACTIVE') {
                // Lanza evento y navega al formulario de registro de paciente
                window.dispatchEvent(
                    new CustomEvent('login-success', {
                        detail: { token: auth.access_token },   // ⬅️  sin redirectTo
                    }),
                );
                navigate('registerPatient');
            } else {
                window.dispatchEvent(
                    new CustomEvent('login-success', {
                        detail: { token: auth.access_token, redirectTo: '/analytics' },
                    }),
                );
                window.location.replace('/analytics');
            }
        } catch {
            setError('Correo o contraseña incorrectos');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="login-wrapper">
                <div className="left-panel">
                    <h1 className="left-title">Bienvenido</h1>
                    <p className="left-subtitle">
                        Inicia sesión con tu correo corporativo
                    </p>
                </div>

                <div className="right-panel">
                    <form onSubmit={handleLogin} className="login-form">
                        <h2 className="form-title">Iniciar sesión</h2>

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

                        {error && <p className="form-error-message">{error}</p>}

                        <Button type="submit" text="Ingresar" />

                        <p className="form-footer-link">
                            ¿Aún no tienes cuenta?{' '}
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('register');
                                }}
                            >
                                Regístrate
                            </a>
                        </p>
                    </form>
                </div>
            </div>

            <LoadingModal show={isSubmitting} text="Iniciando sesión…" />
        </>
    );
}
