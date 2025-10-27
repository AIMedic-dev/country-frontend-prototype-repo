import React, { useState } from 'react';
import type { Chat } from '../../types/chat.types';
import { formatRelativeTime } from '../../../../shared';
import styles from './ChatList.module.css';

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  isActive,
  onSelect,
  onDelete,
}) => {
  const [showDelete, setShowDelete] = useState(false);

  // Obtener el último mensaje o título por defecto
  const getPreview = (): string => {
    if (chat.messages.length === 0) {
      return 'Nueva conversación';
    }
    const lastMessage = chat.messages[chat.messages.length - 1];
    return lastMessage.content.substring(0, 60) + (lastMessage.content.length > 60 ? '...' : '');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de eliminar esta conversación?')) {
      onDelete();
    }
  };

  return (
    <div
      className={`${styles.chatItem} ${isActive ? styles.active : ''}`}
      onClick={onSelect}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div className={styles.chatContent}>
        <p className={styles.chatPreview}>{getPreview()}</p>
        <span className={styles.chatTime}>
          {formatRelativeTime(chat.updatedAt)}
        </span>
      </div>

      {showDelete && !isActive && (
        <button
          className={styles.deleteButton}
          onClick={handleDelete}
          aria-label="Eliminar chat"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};