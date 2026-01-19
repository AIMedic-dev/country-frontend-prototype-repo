import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Modal } from '@/shared/components/Modal/Modal';
import { analyticsCacheService } from '@/modules/admin/services/analyticsCache.service';
import type { CacheInfo } from '@/modules/admin/services/analyticsCache.service';
import styles from './AnalyticsCacheConfig.module.css';

export const AnalyticsCacheConfig = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<CacheInfo | null>(null);
  const [intervalMinutes, setIntervalMinutes] = useState<number>(60);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCacheInfo();
    }
  }, [isOpen]);

  const loadCacheInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const info = await analyticsCacheService.getCacheInfo();
      setCacheInfo(info);
      setIntervalMinutes(info.updateIntervalMinutes);
    } catch (err: any) {
      setError(err.message || 'Error al cargar información de la caché');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateInterval = async () => {
    if (intervalMinutes < 1) {
      setError('El intervalo mínimo es de 1 minuto');
      return;
    }

    try {
      setIsUpdating(true);
      setError(null);
      setSuccess(null);
      await analyticsCacheService.setCacheInterval(intervalMinutes);
      setSuccess(`Intervalo configurado a ${intervalMinutes} minutos`);
      await loadCacheInfo();
    } catch (err: any) {
      setError(err.message || 'Error al configurar el intervalo');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateCache = async () => {
    try {
      setIsUpdating(true);
      setError(null);
      setSuccess(null);
      await analyticsCacheService.updateCache();
      setSuccess('Caché actualizada exitosamente');
      await loadCacheInfo();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la caché');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={styles.configButton}
        title="Configurar caché de analytics"
      >
        <Settings size={18} />
        Configurar caché
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setError(null);
          setSuccess(null);
        }}
        title="Configuración de Caché de Analytics"
        size="md"
      >
        <div className={styles.configContent}>
          {isLoading ? (
            <div className={styles.loading}>Cargando información...</div>
          ) : (
            <>
              {/* Información de la caché */}
              {cacheInfo && (
                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>Estado de la Caché</h3>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Última actualización:</span>
                      <span className={styles.infoValue}>{formatDate(cacheInfo.lastUpdated)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Intervalo actual:</span>
                      <span className={styles.infoValue}>{cacheInfo.updateIntervalMinutes} minutos</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Configurar intervalo */}
              <div className={styles.configSection}>
                <h3 className={styles.sectionTitle}>Intervalo de Actualización</h3>
                <p className={styles.sectionDescription}>
                  Configura cada cuántos minutos se actualiza automáticamente la caché de analytics.
                </p>
                <div className={styles.inputGroup}>
                  <label htmlFor="interval" className={styles.label}>
                    Minutos:
                  </label>
                  <input
                    id="interval"
                    type="number"
                    min="1"
                    value={intervalMinutes}
                    onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                    className={styles.input}
                    disabled={isUpdating}
                  />
                  <button
                    onClick={handleUpdateInterval}
                    disabled={isUpdating || intervalMinutes < 1}
                    className={styles.saveButton}
                  >
                    {isUpdating ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>

              {/* Actualizar caché manualmente */}
              <div className={styles.configSection}>
                <h3 className={styles.sectionTitle}>Actualización Manual</h3>
                <p className={styles.sectionDescription}>
                  Fuerza una actualización inmediata de la caché con datos en tiempo real.
                </p>
                <button
                  onClick={handleUpdateCache}
                  disabled={isUpdating}
                  className={styles.updateButton}
                >
                  {isUpdating ? 'Actualizando...' : 'Actualizar Caché Ahora'}
                </button>
              </div>

              {/* Mensajes de éxito/error */}
              {error && <div className={styles.error}>{error}</div>}
              {success && <div className={styles.success}>{success}</div>}
            </>
          )}
        </div>
      </Modal>
    </>
  );
};
