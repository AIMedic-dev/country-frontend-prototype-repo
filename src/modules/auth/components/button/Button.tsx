import React from 'react';
import styles from './Button.module.css'; // ← Como objeto

type Props = {
  text: string;
  onClick?: () => void;
  type?: 'submit' | 'button';
  disabled?: boolean;
};

export const Button: React.FC<Props> = ({ text, onClick, type = 'button', disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={styles.primaryButton} // ← styles.primaryButton
    >
      {text}
    </button>
  );
};