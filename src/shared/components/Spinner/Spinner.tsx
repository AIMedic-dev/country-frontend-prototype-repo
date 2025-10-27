import React from 'react';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
}) => {
  return (
    <div className={`${styles.spinner} ${styles[size]} ${styles[color]}`}>
      <div className={styles.circle} />
    </div>
  );
};