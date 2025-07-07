import { useState } from 'react';
import { Input } from '../components/input';
import { Button } from '../components/button';
import { verifyCode } from '../services/serviceAuthCode'; 
import { useFormValidation } from '../hooks/useFormValidation'; 
import { registerUser } from '../services/graphql-request'; 
import '../styles/login.css';

type Props = {
    tempUser: { email: string; name: string; password: string };
    navigate: (path: 'login' | 'register' | 'verify') => void;
};

export default function VerifyCode({ tempUser, navigate }: Props) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { validateAuthCode, setFieldError, validation, clearErrors } = useFormValidation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        setError('');
        setSuccess('');

        const codeError = validateAuthCode(code);
        setFieldError('code', codeError);

        if (codeError) return;

        try {
            await verifyCode(tempUser.email, code);
            const response = await registerUser({
                email: tempUser.email,
                name: tempUser.name,
                password: tempUser.password,
                projects: ['country'],
            });
            localStorage.setItem('token', response.access_token);
            navigate('login');
        } catch (err) {
            setError('Código incorrecto o registro fallido: ');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="left-panel">
                <h1 className="left-title">Verificar código</h1>
                <p className="left-subtitle">Ingresa el código enviado a tu correo</p>
            </div>
            <div className="right-panel">
                <form onSubmit={handleSubmit} className="login-form">
                    <h2 className="form-title">Código de verificación</h2>
                    <Input
                        label="Código"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="123456"
                        error={validation.errors.code}
                    />
                    {error && <p className="form-error-message">{error}</p>}
                    {success && <p className="form-success-message">{success}</p>}
                    <Button type="submit" text="Verificar y crear cuenta" />
                </form>
            </div>
        </div>
    );
}
