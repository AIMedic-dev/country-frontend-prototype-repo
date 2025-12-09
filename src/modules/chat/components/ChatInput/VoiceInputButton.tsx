import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { azureSpeechService } from '@/shared/services/azure-speech.service';
import styles from './VoiceInputButton.module.css';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  variant?: 'default' | 'centered';
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  disabled = false,
  variant = 'default',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Verificar si Azure Speech está disponible
    const checkAvailability = async () => {
      const available = azureSpeechService.isAvailable();
      setIsSupported(available);
    };

    checkAvailability();

    // Limpiar al desmontar
    return () => {
      if (isRecording) {
        azureSpeechService.stopRecognition();
      }
    };
  }, []);

  const handleToggleRecording = () => {
    if (!isSupported || disabled) return;

    if (isRecording) {
      // Detener grabación
      azureSpeechService.stopRecognition();
      setIsRecording(false);
    } else {
      // Iniciar grabación
      const started = azureSpeechService.startRecognition({
        language: 'es-ES',
        onResult: (text) => {
          if (text && text.trim()) {
            onTranscript(text.trim());
          }
          // Detener después de recibir el resultado
          azureSpeechService.stopRecognition();
          setIsRecording(false);
        },
        onError: (error) => {
          console.error('Error en reconocimiento de voz:', error);
          setIsRecording(false);
        },
        onStart: () => {
          setIsRecording(true);
        },
        onEnd: () => {
          setIsRecording(false);
        },
      });

      if (!started) {
        console.error('No se pudo iniciar el reconocimiento de voz');
      }
    }
  };

  if (!isSupported) {
    return null; // No mostrar el botón si no está soportado
  }

  return (
    <button
      className={`${styles.voiceButton} ${variant === 'centered' ? styles.centered : ''} ${isRecording ? styles.recording : ''}`}
      onClick={handleToggleRecording}
      disabled={disabled}
      aria-label={isRecording ? 'Detener grabación' : 'Iniciar grabación de voz'}
      type="button"
    >
      <Mic size={20} />
    </button>
  );
};

