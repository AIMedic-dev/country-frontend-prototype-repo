import { useState } from 'react';
import '../styles/CreateAuthCode.css';
// import { sendVerificationCode } from '../services/serviceAuthCode'; // ajusta la ruta real
import LoadingModal from '../loadingModal/LoadingModal';

export default function CreateAuthCode() {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('El correo es obligatorio.');
      return;
    }

    setIsSubmitting(true);

    try {
      // await sendVerificationCode(email);
      setSuccessMessage(`Código enviado a ${email}`);
      setEmail('');
    } catch (err) {
      setErrorMessage('No se pudo generar ni enviar el código.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="authcode-wrapper">
      <h1 className="authcode-title">Generar Código</h1>
      <p className="authcode-subtitle">
        Ingresa el correo electrónico del paciente para generar y enviar un
        código de autenticación.
      </p>

      <form onSubmit={handleGenerateCode} className="authcode-form">
        <label className="authcode-label">Correo electrónico</label>
        <input
          type="email"
          className="authcode-input"
          placeholder="paciente@gmail.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        {errorMessage && <p className="authcode-error">{errorMessage}</p>}
        {successMessage && <p className="authcode-success">{successMessage}</p>}

        <button
          type="submit"
          className="authcode-button"
          disabled={isSubmitting}
        >
          Generar y enviar código
        </button>
      </form>

      <LoadingModal show={isSubmitting} text="Enviando código…" />
    </div>
  );
}