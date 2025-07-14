import { useState, useEffect } from 'react';
import { Input } from '../components/input';
import CancerSelect from '../components/cancerselect';
import { Button } from '../components/button';
import { useFormValidation } from '../hooks/useFormValidation';
import LoadingModal from '../components/loadingModal';

import '../styles/login.css';

import { completePatientRegister } from '../services/patient/graphql-patient';
import { getTokenFromCookie, decodeToken } from '../../../lib/cookies-managment';

type Props = {
  navigate: (path: 'login' | 'register' | 'verify' | 'registerPatient') => void;
};

export default function RegisterPatient({ navigate }: Props) {
  /* Campos */
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [cancerType, setCancerType] = useState('');
  const [stage, setStage] = useState('');

  /* Estado UI */
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Helpers de validación */
  const {
    validateRequired,
    validation,
    clearErrors,
    // acceso directo al setter bajo la manga:
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setFieldError,                       // ya no lo usaremos
  } = useFormValidation();

  /* userName desde el JWT */
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = getTokenFromCookie();
    if (!token) return navigate('login');

    const decoded: any = decodeToken(token);
    const uName = decoded?.userName ?? decoded?.email;
    if (!uName) return navigate('login');

    setUserName(uName);
  }, [navigate]);

  /* ---------------- submit ---------------- */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setError('');

    /* — Construimos errores de una vez — */
    /* — Construimos y filtramos errores — */
    const rawErrors: Record<string, string | null> = {
      name: validateRequired(name, 'Nombre'),
      city: validateRequired(city, 'Ciudad'),
      cancerType: validateRequired(cancerType, 'Tipo de cáncer'),
      stage: validateRequired(stage, 'Etapa'),
    };

    const errors = Object.fromEntries(
      Object.entries(rawErrors).filter(([, v]) => v) // elimina null
    ) as Record<string, string>;

    if (Object.keys(errors).length) {
      /* actualiza tu estado de validación */
      validation.isValid = false;
      validation.errors = errors;
      return; // aborta el submit
    }

    setIsSubmitting(true);

    try {
      if (!userName) throw new Error('Usuario no identificado');

      await completePatientRegister(userName, {
        name,
        city,
        cancerType,
        stage,
        status: 'ACTIVE',
      });

      window.location.replace('/analytics');
    } catch (err) {
      console.error('[RegisterPatient error]', err);
      setError('Ocurrió un error al registrar tus datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <>
      <div className="login-wrapper">
        <div className="left-panel">
          <h1 className="left-title">Registro Paciente</h1>
          <p className="left-subtitle">
            Completa la información para crear tu perfil médico
          </p>
        </div>

        <div className="right-panel">
          <form onSubmit={handleRegister} className="login-form">
            <h2 className="form-title">Datos del Paciente</h2>

            <Input
              label="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={validation.errors.name}
            />

            <Input
              label="Ciudad"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              error={validation.errors.city}
            />

            <CancerSelect
              label="Tipo de cáncer"
              value={cancerType}
              onChange={setCancerType}
              error={validation.errors.cancerType}
            />

            <CancerSelect
              label="Etapa"
              value={stage}
              onChange={setStage}
              options={['Etapa I', 'Etapa II', 'Etapa III', 'Etapa IV']}
              error={validation.errors.stage}
            />

            {error && <p className="form-error-message">{error}</p>}

            <Button
              type="submit"
              text="Registrarse"
              disabled={isSubmitting}
            />

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

      <LoadingModal show={isSubmitting} text="Registrando paciente…" />
    </>
  );
}
