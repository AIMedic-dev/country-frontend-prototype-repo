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

// Datos mock de pacientes (después se puede conectar con el backend)
const MOCK_PATIENTS: Patient[] = [
  { id: 'PAC-001', name: 'María G.', type: 'Cáncer de Seno' },
  { id: 'PAC-002', name: 'Carlos R.', type: 'Gastrointestinal' },
  { id: 'PAC-003', name: 'Ana L.', type: 'Cáncer de Seno' },
  { id: 'all', name: 'Todos los pacientes', type: 'Vista general' },
];

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  selectedPatient = 'all',
  onPatientChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPatientData, setSelectedPatientData] = useState<Patient | null>(
    MOCK_PATIENTS.find((p) => p.id === selectedPatient) || null
  );
  const searchRef = useRef<HTMLDivElement>(null);

  // Solo mostrar "Todos los pacientes" en el dropdown
  const allPatientsOption = MOCK_PATIENTS.find((p) => p.id === 'all');

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
    
    // Si hay un código válido, buscar el paciente
    if (value.trim()) {
      const foundPatient = MOCK_PATIENTS.find(
        (p) => p.id.toLowerCase() === value.trim().toLowerCase()
      );
      if (foundPatient && foundPatient.id !== 'all') {
        setSelectedPatientData(foundPatient);
        onPatientChange?.(foundPatient.id);
      } else {
        setSelectedPatientData(null);
        onPatientChange?.('all');
      }
    } else {
      setSelectedPatientData(null);
      onPatientChange?.('all');
    }
    
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const foundPatient = MOCK_PATIENTS.find(
        (p) => p.id.toLowerCase() === searchQuery.trim().toLowerCase()
      );
      if (foundPatient && foundPatient.id !== 'all') {
        setSelectedPatientData(foundPatient);
        onPatientChange?.(foundPatient.id);
      } else {
        setSelectedPatientData(null);
        onPatientChange?.('all');
      }
    } else {
      setSelectedPatientData(null);
      onPatientChange?.('all');
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
            {isOpen && allPatientsOption && (
              <div className={styles.dropdown}>
                <ul className={styles.optionsList}>
                  <li
                    className={`${styles.option} ${
                      !selectedPatientData || selectedPatientData.id === 'all' ? styles.selected : ''
                    }`}
                    onClick={() => handleSelect(allPatientsOption)}
                  >
                    <div className={styles.optionContent}>
                      <span className={styles.optionName}>{allPatientsOption.name}</span>
                      <span className={styles.optionType}>{allPatientsOption.type}</span>
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

