import React from 'react';
import styles from './Input.module.css'; 

type Props = {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
};

export const Input: React.FC<Props> = ({ label, type = 'text', value, onChange, placeholder, error }) => {
  return (
    <div className={styles.inputGroup}> {/* ← styles.inputGroup */}
      <label className={styles.inputLabel}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.inputField} ${error ? styles.inputError : ''}`}
      />
      {error && <span className={styles.inputErrorMessage}>{error}</span>}
    </div>
  );
};