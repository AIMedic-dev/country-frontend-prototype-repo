import React, { useMemo } from 'react';
import styles from './EmptyChat.module.css';

// 15 mensajes de bienvenida aleatorios para pacientes con cáncer
const WELCOME_MESSAGES = [
  '¿En qué puedo ayudarte hoy?',
  '¿Qué te gustaría saber?',
  '¿Tienes alguna pregunta?',
  '¿Cómo puedo apoyarte hoy?',
  '¿Qué información necesitas?',
  '¿En qué puedo orientarte?',
  '¿Hay algo que quieras consultar?',
  '¿Qué dudas tienes hoy?',
  '¿Necesitas información sobre algo específico?',
  '¿Qué te preocupa en este momento?',
  '¿Cómo te puedo ayudar?',
  '¿Qué quieres saber sobre tu tratamiento?',
  '¿Tienes preguntas sobre tu salud?',
  '¿En qué aspecto puedo orientarte?',
  '¿Qué necesitas saber?',
];

export const EmptyChat: React.FC = () => {
  // Seleccionar un mensaje aleatorio que se mantiene durante la sesión
  const welcomeMessage = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length);
    return WELCOME_MESSAGES[randomIndex];
  }, []);

  return (
    <div className={styles.emptyChat}>
      <div className={styles.content}>
        {/* Icono de carita feliz */}
        <div className={styles.icon}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle 
              cx="40" 
              cy="40" 
              r="36" 
              stroke="currentColor" 
              strokeWidth="3"
              fill="none"
            />
            <circle cx="28" cy="34" r="4" fill="currentColor"/>
            <circle cx="52" cy="34" r="4" fill="currentColor"/>
            <path
              d="M26 48C26 48 31 54 40 54C49 54 54 48 54 48"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Mensaje de bienvenida aleatorio */}
        <h1 className={styles.title}>{welcomeMessage}</h1>

        {/* Mensaje estático de descripción */}
        <p className={styles.subtitle}>
          Escribe tu pregunta y obtén respuestas de nuestra IA especializada
        </p>
      </div>
    </div>
  );
};