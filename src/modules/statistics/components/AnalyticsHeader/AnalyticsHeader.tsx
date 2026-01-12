import React, { useState, useRef, useEffect } from 'react';
import { Activity, User, Search, X } from 'lucide-react';
import styles from './AnalyticsHeader.module.css';

interface Patient {
  id: string;
  name: string;
  type: string;
}

interface AnalyticsHeaderProps {
  selectedPatient?: string;
  onPatientChange?: (patientId: string) => void;
}

// Opción por defecto: Todos los pacientes
const DEFAULT_PATIENT_OPTION: Patient = {
  id: 'all',
  name: 'Todos los pacientes',
  type: 'Vista general',
};

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  selectedPatient = 'all',
  onPatientChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPatientData, setSelectedPatientData] = useState<Patient | null>(
    selectedPatient === 'all' ? DEFAULT_PATIENT_OPTION : null
  );
  const searchRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (patient: Patient) => {
    setSelectedPatientData(patient);
    setSearchQuery('');
    setIsOpen(false);
    onPatientChange?.(patient.id);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedPatientData(null);
    setIsOpen(false);
    onPatientChange?.('all');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Si el campo está vacío, mostrar "Todos los pacientes"
    if (!value.trim()) {
      setSelectedPatientData(DEFAULT_PATIENT_OPTION);
      onPatientChange?.('all');
    } else {
      // Por ahora, solo permitir buscar "Todos los pacientes"
      // En el futuro, esto se conectará con el backend para buscar pacientes reales
      setSelectedPatientData(null);
    }
    
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSelectedPatientData(DEFAULT_PATIENT_OPTION);
      onPatientChange?.('all');
    } else {
      // Por ahora, solo permitir buscar "Todos los pacientes"
      // En el futuro, esto se conectará con el backend para buscar pacientes reales
      setSelectedPatientData(null);
    }
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          <h1 className={styles.headerTitle}>
            <Activity className={styles.headerIcon} size={36} />
            Análisis Oncológico
          </h1>
          <p className={styles.headerSubtitle}>
            Análisis de conversaciones
          </p>
        </div>
          <div className={styles.headerRight} ref={searchRef}>
          <User className={styles.userIcon} size={24} />
          <div className={styles.searchContainer}>
            <div className={styles.searchInputWrapper}>
              <button
                type="button"
                className={styles.searchButton}
                onClick={handleSearch}
                aria-label="Buscar paciente"
              >
                <Search className={styles.searchIcon} size={20} />
              </button>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Buscar por código (ej: PAC-001)"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onKeyPress={handleKeyPress}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={handleClear}
                  aria-label="Limpiar búsqueda"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {isOpen && (
              <div className={styles.dropdown}>
                <ul className={styles.optionsList}>
                  <li
                    className={`${styles.option} ${
                      !selectedPatientData || selectedPatientData.id === 'all' ? styles.selected : ''
                    }`}
                    onClick={() => handleSelect(DEFAULT_PATIENT_OPTION)}
                  >
                    <div className={styles.optionContent}>
                      <span className={styles.optionName}>{DEFAULT_PATIENT_OPTION.name}</span>
                      <span className={styles.optionType}>{DEFAULT_PATIENT_OPTION.type}</span>
                    </div>
                    <span className={styles.optionBadge}>Vista general</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

