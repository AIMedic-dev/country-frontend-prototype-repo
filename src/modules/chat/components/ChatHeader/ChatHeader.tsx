import React from 'react';
import styles from './ChatHeader.module.css';

interface ChatHeaderProps {
  title?: string;
  messageCount?: number;
  onClear?: () => void;
  onMenuClick?: () => void; 
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = 'Chat con IA',
  messageCount = 0,
  onClear,
  onMenuClick, 
}) => {
  return (
    <header className={styles.header}>
      {/* Botón hamburguesa */}
      {onMenuClick && (
        <button
          className={styles.menuButton}
          onClick={onMenuClick}
          aria-label="Abrir menú"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 6H21M3 12H21M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}

      <div className={styles.info}>
        <h1 className={styles.title}>{title}</h1>
        {messageCount > 0 && (
          <span className={styles.count}>{messageCount} mensajes</span>
        )}
      </div>

      {messageCount > 0 && onClear && (
        <button className={styles.clearButton} onClick={onClear}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 7H15M8 10V14M12 10V14M6 7V15C6 15.5304 6.21071 16.0391 6.58579 16.4142C6.96086 16.7893 7.46957 17 8 17H12C12.5304 17 13.0391 16.7893 13.4142 16.4142C13.7893 16.0391 14 15.5304 14 15V7M7 7V5C7 4.73478 7.10536 4.48043 7.29289 4.29289C7.48043 4.10536 7.73478 4 8 4H12C12.2652 4 12.5196 4.10536 12.7071 4.29289C12.8946 4.48043 13 4.73478 13 5V7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Limpiar chat
        </button>
      )}
    </header>
  );
};