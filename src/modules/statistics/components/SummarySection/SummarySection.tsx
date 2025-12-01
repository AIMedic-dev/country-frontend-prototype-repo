import React from 'react';
import styles from './SummarySection.module.css';

export const SummarySection: React.FC = () => {
  return (
    <div className={styles.summaryContainer}>
      <h2 className={styles.summaryTitle}>Resumen General de Interacciones</h2>
      <div className={styles.summaryContent}>
        <div className={styles.summarySection}>
          <p className={styles.sectionLabel}>PERIODO DE ANÁLISIS</p>
          <p className={styles.sectionText}>
            20 - 26 de Noviembre 2025 (7 días) • 24 conversaciones totales
          </p>
        </div>

        <div className={styles.summaryDivider}></div>

        <div className={styles.summarySection}>
          <p className={styles.sectionLabel}>SÍNTOMAS Y EFECTOS MÁS CONSULTADOS</p>
          <p className={styles.sectionText}>
            La paciente ha manifestado preocupación recurrente sobre episodios de vómito,
            especialmente durante las primeras horas de la mañana y después de las comidas.
            Menciona que los vómitos han sido más frecuentes en los últimos 3 días. También
            reporta mareos constantes que dificultan sus actividades diarias, principalmente al
            levantarse o cambiar de posición bruscamente.
          </p>
          <p className={styles.sectionText}>
            Respecto al catéter, la paciente ha consultado en múltiples ocasiones sobre los
            cuidados necesarios, expresando dudas sobre la limpieza adecuada y signos de alerta.
            Menciona leve enrojecimiento en la zona, pero sin dolor significativo. Ha preguntado
            sobre cuándo puede bañarse y cómo proteger el área durante el aseo personal.
          </p>
        </div>

        <div className={styles.summaryDivider}></div>

        <div className={styles.summarySection}>
          <p className={styles.sectionLabel}>EVOLUCIÓN DEL DOLOR</p>
          <p className={styles.sectionText}>
            El nivel de dolor ha mostrado una tendencia descendente durante la semana. Inició
            con niveles de 3-4/10, alcanzando un pico de 5/10 el día 22 de noviembre. A partir
            del día 23, el dolor comenzó a disminuir progresivamente hasta estabilizarse en 2/10
            en los últimos dos días. La paciente asocia el dolor principalmente con la zona
            abdominal y menciona que mejora con reposo.
          </p>
        </div>

        <div className={styles.summaryDivider}></div>

        <div className={styles.summarySection}>
          <p className={styles.sectionLabel}>ESTADO GENERAL Y PREOCUPACIONES</p>
          <p className={styles.sectionText}>
            La paciente reporta fatiga constante que limita su capacidad para realizar tareas
            cotidianas. Ha manifestado pérdida de apetito significativa, mencionando que solo
            logra consumir pequeñas porciones de alimento. Expresó preocupaciones sobre su
            nutrición y preguntó sobre alimentos recomendados que sean fáciles de digerir y no
            le provoquen náuseas.
          </p>
          <p className={styles.sectionText}>
            En las conversaciones más recientes, la paciente ha consultado sobre la duración
            esperada de estos efectos y si es normal experimentarlos con esta intensidad. También
            preguntó sobre actividades físicas ligeras que pueda realizar sin afectar su
            recuperación.
          </p>
        </div>

        <div className={styles.summaryDivider}></div>

        <div className={styles.summarySection}>
          <p className={styles.sectionLabel}>ASPECTOS EMOCIONALES</p>
          <p className={styles.sectionText}>
            La paciente ha compartido sentimientos de ansiedad relacionados con el proceso de
            tratamiento. Ha preguntado sobre grupos de apoyo y experiencias de otras pacientes.
            Muestra interés en comprender mejor su condición y los cambios que está
            experimentando en su cuerpo.
          </p>
        </div>

        <div className={styles.noteBox}>
          <p className={styles.noteText}>
            💡 Nota: Este resumen consolida las 24 interacciones del período. Se recomienda
            revisar conversaciones específicas para detalles adicionales.
          </p>
        </div>
      </div>
    </div>
  );
};

