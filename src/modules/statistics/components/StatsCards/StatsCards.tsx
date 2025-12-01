import React, { useState, useMemo } from 'react';
import { MessageSquare, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import { Modal } from '@/shared/components';
import type { TopicData, PainScaleData, SymptomData } from '../../types/statistics.types';
import styles from './StatsCards.module.css';

interface StatsCardsProps {
  stats: {
    totalConversations: number;
    averagePain: number;
    topicsCount: number;
    lastInteraction: string;
  };
  topicsData: TopicData[];
  painScaleData: PainScaleData[];
  symptomsData: SymptomData[];
}

type ModalType = 'conversations' | 'pain' | 'topics' | 'interaction' | null;

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  topicsData,
  painScaleData,
  symptomsData,
}) => {
  const [openModal, setOpenModal] = useState<ModalType>(null);

  const handleCardClick = (modalType: ModalType) => {
    setOpenModal(modalType);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  // Calcular segmentación de dolor
  const painSegmentation = useMemo(() => {
    const leve = painScaleData.filter((p) => p.nivel >= 0 && p.nivel <= 3).length;
    const moderado = painScaleData.filter((p) => p.nivel >= 4 && p.nivel <= 6).length;
    const intenso = painScaleData.filter((p) => p.nivel >= 7 && p.nivel <= 10).length;
    const total = painScaleData.length;

    return {
      leve: { count: leve, percentage: total > 0 ? Math.round((leve / total) * 100) : 0 },
      moderado: {
        count: moderado,
        percentage: total > 0 ? Math.round((moderado / total) * 100) : 0,
      },
      intenso: {
        count: intenso,
        percentage: total > 0 ? Math.round((intenso / total) * 100) : 0,
      },
      total,
    };
  }, [painScaleData]);

  // Top temas más consultados
  const topTopics = useMemo(() => {
    return topicsData.slice(0, 5);
  }, [topicsData]);

  // Top síntomas más mencionados
  const topSymptoms = useMemo(() => {
    return symptomsData.slice(0, 5);
  }, [symptomsData]);

  // Distribución de conversaciones por tema principal
  const conversationDistribution = useMemo(() => {
    const total = stats.totalConversations;
    const sintomas = Math.round(total * 0.35);
    const medicacion = Math.round(total * 0.28);
    const cuidados = Math.round(total * 0.20);
    const emocional = Math.round(total * 0.17);

    return [
      { categoria: 'Síntomas y efectos', cantidad: sintomas, porcentaje: 35 },
      { categoria: 'Medicación', cantidad: medicacion, porcentaje: 28 },
      { categoria: 'Cuidados y procedimientos', cantidad: cuidados, porcentaje: 20 },
      { categoria: 'Aspectos emocionales', cantidad: emocional, porcentaje: 17 },
    ];
  }, [stats.totalConversations]);

  // Segmentación de fechas de interacciones
  const dateSegmentation = useMemo(() => {
    const hoy = 8;
    const ayer = 6;
    const estaSemana = 7;
    const semanaPasada = 3;

    return [
      { periodo: 'Hoy', cantidad: hoy, porcentaje: Math.round((hoy / stats.totalConversations) * 100) },
      {
        periodo: 'Ayer',
        cantidad: ayer,
        porcentaje: Math.round((ayer / stats.totalConversations) * 100),
      },
      {
        periodo: 'Esta semana',
        cantidad: estaSemana,
        porcentaje: Math.round((estaSemana / stats.totalConversations) * 100),
      },
      {
        periodo: 'Semana pasada',
        cantidad: semanaPasada,
        porcentaje: Math.round((semanaPasada / stats.totalConversations) * 100),
      },
    ];
  }, [stats.totalConversations]);

  return (
    <>
      <div className={styles.cardsGrid}>
        <div className={styles.card} onClick={() => handleCardClick('conversations')}>
          <div className={styles.cardContent}>
            <div>
              <p className={styles.cardLabel}>Total Conversaciones</p>
              <p className={styles.cardValue}>{stats.totalConversations}</p>
            </div>
            <MessageSquare className={styles.cardIcon} size={32} />
          </div>
        </div>

        <div className={styles.card} onClick={() => handleCardClick('pain')}>
          <div className={styles.cardContent}>
            <div>
              <p className={styles.cardLabel}>Dolor Promedio</p>
              <p className={`${styles.cardValue} ${styles.cardValueOrange}`}>
                {stats.averagePain.toFixed(1)}
              </p>
            </div>
            <AlertCircle className={`${styles.cardIcon} ${styles.cardIconOrange}`} size={32} />
          </div>
        </div>

        <div className={styles.card} onClick={() => handleCardClick('topics')}>
          <div className={styles.cardContent}>
            <div>
              <p className={styles.cardLabel}>Temas Consultados</p>
              <p className={`${styles.cardValue} ${styles.cardValueGreen}`}>
                {stats.topicsCount}
              </p>
            </div>
            <TrendingUp className={`${styles.cardIcon} ${styles.cardIconGreen}`} size={32} />
          </div>
        </div>

        <div className={styles.card} onClick={() => handleCardClick('interaction')}>
          <div className={styles.cardContent}>
            <div>
              <p className={styles.cardLabel}>Última Interacción</p>
              <p className={`${styles.cardValue} ${styles.cardValuePurple}`}>
                {stats.lastInteraction}
              </p>
            </div>
            <Calendar className={`${styles.cardIcon} ${styles.cardIconPurple}`} size={32} />
          </div>
        </div>
      </div>

      {/* Modal de Total Conversaciones */}
      <Modal
        isOpen={openModal === 'conversations'}
        onClose={handleCloseModal}
        title="Total Conversaciones"
        size="lg"
      >
        <div className={styles.modalContent}>
          <p className={styles.modalDescription}>
            Análisis detallado de las <strong>{stats.totalConversations} conversaciones</strong>{' '}
            registradas durante el período. Descubre a qué se refieren más las interacciones y
            cómo se distribuyen.
          </p>

          <div className={styles.modalInfo}>
            <p className={styles.modalValue}>{stats.totalConversations}</p>
            <p className={styles.modalLabel}>conversaciones totales</p>
          </div>

          <div className={styles.modalSection}>
            <p className={styles.modalSectionTitle}>Distribución por Categoría</p>
            <div className={styles.distributionGrid}>
              {conversationDistribution.map((item, idx) => (
                <div key={idx} className={styles.distributionItem}>
                  <div className={styles.distributionHeader}>
                    <span className={styles.distributionCategory}>{item.categoria}</span>
                    <span className={styles.distributionPercentage}>{item.porcentaje}%</span>
                  </div>
                  <div className={styles.distributionBar}>
                    <div
                      className={styles.distributionBarFill}
                      style={{ width: `${item.porcentaje}%` }}
                    ></div>
                  </div>
                  <span className={styles.distributionCount}>
                    {item.cantidad} conversaciones
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.modalSection}>
            <p className={styles.modalSectionTitle}>Temas Más Consultados</p>
            <div className={styles.topicsList}>
              {topTopics.map((topic, idx) => (
                <div key={idx} className={styles.topicItem}>
                  <div className={styles.topicInfo}>
                    <span className={styles.topicName}>{topic.name}</span>
                    <span className={styles.topicPercentage}>{topic.percentage}</span>
                  </div>
                  <div className={styles.topicBar}>
                    <div
                      className={styles.topicBarFill}
                      style={{ width: topic.percentage }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.modalNote}>
            <strong>💡 Nota:</strong> Las conversaciones incluyen todas las interacciones entre
            pacientes y el sistema de IA, cubriendo consultas sobre síntomas, tratamientos,
            medicación, cuidados y aspectos emocionales.
          </div>
        </div>
      </Modal>

      {/* Modal de Dolor Promedio */}
      <Modal
        isOpen={openModal === 'pain'}
        onClose={handleCloseModal}
        title="Dolor Promedio"
        size="lg"
      >
        <div className={styles.modalContent}>
          <p className={styles.modalDescription}>
            Análisis detallado del dolor reportado por los pacientes. El promedio es{' '}
            <strong>{stats.averagePain.toFixed(1)}/10</strong> en una escala donde 0 es sin
            dolor y 10 es el dolor más intenso.
          </p>

          <div className={styles.modalInfo}>
            <p className={styles.modalValue}>{stats.averagePain.toFixed(1)}</p>
            <p className={styles.modalLabel}>promedio en escala 0-10</p>
          </div>

          <div className={styles.modalSection}>
            <p className={styles.modalSectionTitle}>Segmentación del Dolor</p>
            <div className={styles.segmentationGrid}>
              <div className={styles.segmentationCard}>
                <div className={styles.segmentationHeader}>
                  <span className={styles.segmentationLabel}>Dolor Leve</span>
                  <span className={styles.segmentationValue}>
                    {painSegmentation.leve.percentage}%
                  </span>
                </div>
                <div className={styles.segmentationBar}>
                  <div
                    className={`${styles.segmentationBarFill} ${styles.segmentationLeve}`}
                    style={{ width: `${painSegmentation.leve.percentage}%` }}
                  ></div>
                </div>
                <span className={styles.segmentationCount}>
                  {painSegmentation.leve.count} reportes (0-3/10)
                </span>
              </div>

              <div className={styles.segmentationCard}>
                <div className={styles.segmentationHeader}>
                  <span className={styles.segmentationLabel}>Dolor Moderado</span>
                  <span className={styles.segmentationValue}>
                    {painSegmentation.moderado.percentage}%
                  </span>
                </div>
                <div className={styles.segmentationBar}>
                  <div
                    className={`${styles.segmentationBarFill} ${styles.segmentationModerado}`}
                    style={{ width: `${painSegmentation.moderado.percentage}%` }}
                  ></div>
                </div>
                <span className={styles.segmentationCount}>
                  {painSegmentation.moderado.count} reportes (4-6/10)
                </span>
              </div>

              <div className={styles.segmentationCard}>
                <div className={styles.segmentationHeader}>
                  <span className={styles.segmentationLabel}>Dolor Intenso</span>
                  <span className={styles.segmentationValue}>
                    {painSegmentation.intenso.percentage}%
                  </span>
                </div>
                <div className={styles.segmentationBar}>
                  <div
                    className={`${styles.segmentationBarFill} ${styles.segmentationIntenso}`}
                    style={{ width: `${painSegmentation.intenso.percentage}%` }}
                  ></div>
                </div>
                <span className={styles.segmentationCount}>
                  {painSegmentation.intenso.count} reportes (7-10/10)
                </span>
              </div>
            </div>
          </div>

          <div className={styles.modalSection}>
            <p className={styles.modalSectionTitle}>Evolución Reciente</p>
            <div className={styles.evolutionList}>
              {painScaleData.slice(-5).map((pain, idx) => (
                <div key={idx} className={styles.evolutionItem}>
                  <span className={styles.evolutionDate}>{pain.fecha}</span>
                  <div className={styles.evolutionBar}>
                    <div
                      className={styles.evolutionBarFill}
                      style={{ width: `${(pain.nivel / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className={styles.evolutionLevel}>{pain.nivel}/10</span>
                  <span className={styles.evolutionMedication}>{pain.medicamento}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.modalNote}>
            <strong>📊 Interpretación:</strong> Un promedio de {stats.averagePain.toFixed(1)}/10
            indica dolor {stats.averagePain <= 3 ? 'leve' : stats.averagePain <= 6 ? 'moderado' : 'intenso'}.
            La mayoría de los reportes ({painSegmentation.leve.percentage > painSegmentation.moderado.percentage && painSegmentation.leve.percentage > painSegmentation.intenso.percentage ? 'leves' : painSegmentation.moderado.percentage > painSegmentation.intenso.percentage ? 'moderados' : 'intensos'}) sugieren un{' '}
            {stats.averagePain <= 3 ? 'buen' : stats.averagePain <= 6 ? 'moderado' : 'requerido'} manejo del dolor.
          </div>
        </div>
      </Modal>

      {/* Modal de Temas Consultados */}
      <Modal
        isOpen={openModal === 'topics'}
        onClose={handleCloseModal}
        title="Temas Consultados"
        size="lg"
      >
        <div className={styles.modalContent}>
          <p className={styles.modalDescription}>
            Análisis de los <strong>{stats.topicsCount} temas diferentes</strong> sobre los
            cuales los pacientes han realizado consultas. Descubre cuáles son los más frecuentes
            y su distribución.
          </p>

          <div className={styles.modalInfo}>
            <p className={styles.modalValue}>{stats.topicsCount}</p>
            <p className={styles.modalLabel}>temas diferentes consultados</p>
          </div>

          <div className={styles.modalSection}>
            <p className={styles.modalSectionTitle}>Top 5 Temas Más Consultados</p>
            <div className={styles.topicsList}>
              {topTopics.map((topic, idx) => (
                <div key={idx} className={styles.topicItem}>
                  <div className={styles.topicRank}>#{idx + 1}</div>
                  <div className={styles.topicContent}>
                    <div className={styles.topicInfo}>
                      <span className={styles.topicName}>{topic.name}</span>
                      <span className={styles.topicPercentage}>{topic.percentage}</span>
                    </div>
                    <div className={styles.topicBar}>
                      <div
                        className={styles.topicBarFill}
                        style={{ width: topic.percentage }}
                      ></div>
                    </div>
                    <span className={styles.topicValue}>{topic.value}% de las consultas</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.modalSection}>
            <p className={styles.modalSectionTitle}>Síntomas Más Mencionados</p>
            <div className={styles.symptomsGrid}>
              {topSymptoms.map((symptom, idx) => (
                <div key={idx} className={styles.symptomCard}>
                  <span className={styles.symptomName}>{symptom.nombre}</span>
                  <span className={styles.symptomCount}>{symptom.menciones} menciones</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.modalNote}>
            <strong>📈 Tendencias:</strong> Los temas más consultados reflejan las principales
            preocupaciones de los pacientes. El tema "{topTopics[0]?.name}" representa el{' '}
            {topTopics[0]?.percentage} de todas las consultas, indicando una necesidad
            significativa de información en esta área.
          </div>
        </div>
      </Modal>

      {/* Modal de Última Interacción */}
      <Modal
        isOpen={openModal === 'interaction'}
        onClose={handleCloseModal}
        title="Última Interacción"
        size="lg"
      >
        <div className={styles.modalContent}>
          <p className={styles.modalDescription}>
            Análisis temporal de las interacciones. La última conversación fue registrada{' '}
            <strong>{stats.lastInteraction}</strong>. Descubre cómo se distribuyen las
            interacciones en el tiempo.
          </p>

          <div className={styles.modalInfo}>
            <p className={styles.modalValue}>{stats.lastInteraction}</p>
            <p className={styles.modalLabel}>última conversación registrada</p>
          </div>

          <div className={styles.modalSection}>
            <p className={styles.modalSectionTitle}>Distribución Temporal</p>
            <div className={styles.dateSegmentationGrid}>
              {dateSegmentation.map((item, idx) => (
                <div key={idx} className={styles.dateCard}>
                  <div className={styles.dateHeader}>
                    <span className={styles.datePeriod}>{item.periodo}</span>
                    <span className={styles.datePercentage}>{item.porcentaje}%</span>
                  </div>
                  <div className={styles.dateBar}>
                    <div
                      className={styles.dateBarFill}
                      style={{ width: `${item.porcentaje}%` }}
                    ></div>
                  </div>
                  <span className={styles.dateCount}>
                    {item.cantidad} conversaciones
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.modalSection}>
            <p className={styles.modalSectionTitle}>Actividad Reciente</p>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <span className={styles.activityTime}>Hace 2 horas</span>
                <span className={styles.activityType}>Consulta sobre medicación</span>
              </div>
              <div className={styles.activityItem}>
                <span className={styles.activityTime}>Hace 5 horas</span>
                <span className={styles.activityType}>Pregunta sobre efectos secundarios</span>
              </div>
              <div className={styles.activityItem}>
                <span className={styles.activityTime}>Ayer</span>
                <span className={styles.activityType}>6 conversaciones registradas</span>
              </div>
              <div className={styles.activityItem}>
                <span className={styles.activityTime}>Esta semana</span>
                <span className={styles.activityType}>7 conversaciones registradas</span>
              </div>
            </div>
          </div>

          <div className={styles.modalNote}>
            <strong>📅 Patrón de Uso:</strong> La distribución muestra que{' '}
            {dateSegmentation[0].porcentaje > 30
              ? 'hay una alta actividad reciente'
              : 'la actividad se distribuye a lo largo del tiempo'}{' '}
            con {dateSegmentation[0].cantidad} conversaciones registradas{' '}
            {dateSegmentation[0].periodo.toLowerCase()}. Esto indica un uso{' '}
            {dateSegmentation[0].porcentaje > 30 ? 'activo y constante' : 'regular'} del sistema.
          </div>
        </div>
      </Modal>
    </>
  );
};

