import { useState } from 'react';
import { Input } from '../components/input';
import CancerSelect from '../components/cancerselect';
import { Button } from '../components/button';
import { useFormValidation } from '../hooks/useFormValidation';
import LoadingModal from '../components/LoadingModal';
import '../styles/login.css'; // Reutiliza estilos base, si tienes uno específico cámbialo.

type Props = {
  navigate: (path: 'login' | 'register' | 'verify' | 'registerPatient') => void;
};

export default function RegisterPatient({ navigate }: Props) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [cancerType, setCancerType] = useState('');
  const [stage, setStage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    validateRequired,
    setFieldError,
    validation,
    clearErrors,
  } = useFormValidation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setError('');

    const nameError = validateRequired(name, 'Nombre');
    const cityError = validateRequired(city, 'Ciudad');
    const cancerTypeError = validateRequired(cancerType, 'Tipo de cáncer');
    const stageError = validateRequired(stage, 'Etapa');

    setFieldError('name', nameError);
    setFieldError('city', cityError);
    setFieldError('cancerType', cancerTypeError);
    setFieldError('stage', stageError);

    if (nameError || cityError || cancerTypeError || stageError) return;

    setIsSubmitting(true);

    try {
      // Aquí conecta con tu backend o base de datos.
      console.log({
        name,
        city,
        cancerType,
        stage,
      });

      // Ejemplo:
      // await registerPatient({ name, city, cancerType, stage });
      // navigate('verify');
    } catch (err) {
      setError('Ocurrió un error al registrar el paciente.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Pérez"
              error={validation.errors.name}
            />

            <Input
              label="Ciudad"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Bogotá"
              error={validation.errors.city}
            />

            <CancerSelect
              label="Tipo de cáncer"
              value={cancerType}
              onChange={setCancerType}
            />

            <CancerSelect
              label="Etapa"
              value={stage}
              onChange={setStage}
              options={[
                'Etapa I',
                'Etapa II',
                'Etapa III',
                'Etapa IV',
              ]}
            />

            {error && <p className="form-error-message">{error}</p>}

            <Button type="submit" text="Registrarse" disabled={isSubmitting} />

            <p className="form-footer-link">
              ¿Ya tienes cuenta?{" "}
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
