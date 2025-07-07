import { useState } from 'react';
import { loginUser } from '../services/graphql-request';  // TODO: Cambiar a la ruta correcta 
import { Input } from '../components/input';
import { Button } from '../components/button';
import { useFormValidation } from '../hooks/useFormValidation';
import '../styles/login.css';
// import { saveTokenToCookie, getRedirectUrl } from '../../utils/funtions';
import { saveTokenToCookie } from '../utils/funtions';
import { ProjectEnum } from '../types/types';

type Props = {
    navigate: (path: 'login' | 'register' | 'verify') => void;
};

export default function Login({ navigate }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const {
        validateEmail,
        validatePassword,
        validateRequired,
        setFieldError,
        validation,
        clearErrors,
    } = useFormValidation();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        setError('');

        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        setFieldError('email', emailError);
        setFieldError('password', passwordError);

        if (emailError || passwordError) return;

        try {
            const data = await loginUser({ email, password });

            if(data){
                console.log(data);
                saveTokenToCookie(data.access_token);
                window.dispatchEvent(new CustomEvent('login-success', { detail: { token: data.access_token } }));
                // const redirectUrl = '/';
                // if(redirectUrl){
                //     window.location.href = redirectUrl;
                // }
            }
            // localStorage.setItem('token', data.access_token);
            // navigate('login'); // redirige a donde necesites
        } catch (err) {
            setError('Correo o contraseña incorrectos');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="left-panel">
                <h1 className="left-title">Bienvenido</h1>
                <p className="left-subtitle">Inicia sesión con tu correo corporativo</p>
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
                        ¿Aún no tienes cuenta?{" "}
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
    );
}
