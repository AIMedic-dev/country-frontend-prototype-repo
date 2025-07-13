import React, { useState, useRef, useEffect } from 'react';
import '../styles/cancerselect.css';

export interface CancerSelectProps {
  /** Etiqueta visible sobre el campo */
  label?: string;
  /** Valor seleccionado */
  value?: string;
  /** Callback al cambiar la selección */
  onChange?: (value: string) => void;
  /** Lista de opciones (si quieres sobreescribir las predeterminadas) */
  options?: string[];
  /** Texto de error para validación */
  error?: string | null;
}

const DEFAULT_OPTIONS = [
  'Cáncer de mama',
  'Cáncer de pulmón',
  'Cáncer de próstata',
  'Cáncer colorrectal',
  'Cáncer de piel (melanoma)',
  'Linfoma no Hodgkin',
  'Leucemia',
  'Cáncer de páncreas',
  'Cáncer de tiroides',
  'Cáncer de riñón',
  'Cáncer de vejiga',
  'Cáncer de endometrio',
  'Cáncer de ovario',
  'Cáncer de cuello uterino',
  'Tumores cerebrales y del sistema nervioso central',
];

export default function CancerSelect({
  label = 'Tipo de cáncer',
  value = '',
  onChange,
  options = DEFAULT_OPTIONS,
  error = null,
}: CancerSelectProps) {
  const [isOpen, setIsOpen]   = useState(false);
  const [search, setSearch]   = useState('');
  const ref                   = useRef<HTMLDivElement>(null);

  /* Cierra el desplegable al hacer clic fuera */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (val: string) => {
    onChange?.(val);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="cs-container" ref={ref}>
      {label && <label className="cs-label">{label}</label>}

      {/* Campo visible */}
      <button
        type="button"
        className={`cs-input ${error ? 'cs-error' : ''}`}
        onClick={() => setIsOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {value || 'Seleccione…'}
        <span className="cs-chevron" aria-hidden="true" />
      </button>

      {error && <p className="cs-error-message">{error}</p>}

      {/* Desplegable */}
      {isOpen && (
        <div className="cs-dropdown" role="listbox">
          <input
            type="text"
            className="cs-search"
            placeholder="Buscar…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <ul className="cs-options">
            {filtered.length === 0 && (
              <li className="cs-empty">Sin resultados</li>
            )}
            {filtered.map((opt) => (
              <li
                key={opt}
                className={`cs-option ${opt === value ? 'selected' : ''}`}
                onClick={() => handleSelect(opt)}
                role="option"
                aria-selected={opt === value}
              >
                {opt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
