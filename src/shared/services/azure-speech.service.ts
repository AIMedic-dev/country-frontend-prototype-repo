import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { ENV } from '../config/env';

export interface SpeechRecognitionConfig {
  language?: string;
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

class AzureSpeechService {
  private speechConfig: SpeechSDK.SpeechConfig | null = null;
  private audioConfig: SpeechSDK.AudioConfig | null = null;
  private recognizer: SpeechSDK.SpeechRecognizer | null = null;
  private isInitialized = false;

  /**
   * Inicializar el servicio de Azure Speech
   */
  initialize(): boolean {
    if (this.isInitialized && this.speechConfig) {
      return true;
    }

    if (!ENV.AZURE_SPEECH_KEY || !ENV.AZURE_SPEECH_REGION) {
      console.error('Azure Speech credentials not configured');
      return false;
    }

    try {
      // Crear configuración de Speech
      this.speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
        ENV.AZURE_SPEECH_KEY,
        ENV.AZURE_SPEECH_REGION
      );

      // Configurar idioma (español por defecto)
      this.speechConfig.speechRecognitionLanguage = 'es-ES';

      // Configurar formato de salida
      this.speechConfig.outputFormat = SpeechSDK.OutputFormat.Detailed;

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing Azure Speech:', error);
      return false;
    }
  }

  /**
   * Iniciar reconocimiento de voz
   */
  startRecognition(config: SpeechRecognitionConfig): boolean {
    if (!this.initialize()) {
      return false;
    }

    try {
      // Detener reconocimiento anterior si existe
      this.stopRecognition();

      // Configurar audio desde el micrófono
      this.audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

      // Crear reconocedor
      this.recognizer = new SpeechSDK.SpeechRecognizer(
        this.speechConfig!,
        this.audioConfig
      );

      // Configurar idioma si se especifica
      if (config.language) {
        this.speechConfig!.speechRecognitionLanguage = config.language;
      }

      // Evento: reconocimiento continuo
      this.recognizer.recognizing = (_s, e) => {
        if (e.result.reason === SpeechSDK.ResultReason.RecognizingSpeech) {
          // Texto parcial mientras se está reconociendo
          // Opcional: puedes mostrar texto parcial
        }
      };

      // Evento: resultado final
      this.recognizer.recognized = (_s, e) => {
        if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
          const text = e.result.text;
          if (text && config.onResult) {
            config.onResult(text);
          }
        } else if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
          if (config.onError) {
            config.onError('No se pudo reconocer el audio');
          }
        }
      };

      // Evento: error
      this.recognizer.canceled = (_s, e) => {
        if (e.reason === SpeechSDK.CancellationReason.Error) {
          const errorMsg = `Error: ${e.errorDetails}`;
          console.error('Azure Speech error:', errorMsg);
          if (config.onError) {
            config.onError(errorMsg);
          }
        }
        if (config.onEnd) {
          config.onEnd();
        }
      };

      // Evento: sesión iniciada
      this.recognizer.sessionStarted = () => {
        if (config.onStart) {
          config.onStart();
        }
      };

      // Evento: sesión finalizada
      this.recognizer.sessionStopped = () => {
        if (config.onEnd) {
          config.onEnd();
        }
      };

      // Iniciar reconocimiento continuo
      this.recognizer.startContinuousRecognitionAsync(
        () => {
          console.log('Azure Speech recognition started');
        },
        (error) => {
          console.error('Error starting recognition:', error);
          if (config.onError) {
            config.onError('Error al iniciar el reconocimiento de voz');
          }
        }
      );

      return true;
    } catch (error) {
      console.error('Error starting Azure Speech recognition:', error);
      if (config.onError) {
        config.onError('Error al iniciar el reconocimiento de voz');
      }
      return false;
    }
  }

  /**
   * Detener reconocimiento de voz
   */
  stopRecognition(): void {
    if (this.recognizer) {
      try {
        this.recognizer.stopContinuousRecognitionAsync(
          () => {
            console.log('Azure Speech recognition stopped');
          },
          (error) => {
            console.error('Error stopping recognition:', error);
          }
        );
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
      this.recognizer.close();
      this.recognizer = null;
    }

    if (this.audioConfig) {
      this.audioConfig.close();
      this.audioConfig = null;
    }
  }

  /**
   * Verificar si el servicio está disponible
   */
  isAvailable(): boolean {
    return this.initialize();
  }

  /**
   * Limpiar recursos
   */
  dispose(): void {
    this.stopRecognition();
    if (this.speechConfig) {
      this.speechConfig.close();
      this.speechConfig = null;
    }
    this.isInitialized = false;
  }
}

// Exportar instancia única
export const azureSpeechService = new AzureSpeechService();

