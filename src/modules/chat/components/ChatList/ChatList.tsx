
import React from 'react';
import type { Chat } from '../../types/chat.types';
import { ChatItem } from './ChatItem';
import { Spinner } from '../../../../shared';
import styles from './ChatList.module.css';

interface ChatListProps {
  chats: Chat[];
  activeChat: string | null;
  onChatSelect: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  isLoading?: boolean;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChat,
  onChatSelect,
  onDeleteChat,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="md" color="primary" />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p className={styles.emptyText}>No hay conversaciones</p>
        <p className={styles.emptySubtext}>Crea una nueva para comenzar</p>
      </div>
    );
  }

  return (
    <div className={styles.chatList}>
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isActive={activeChat === chat.id}
          onSelect={() => onChatSelect(chat.id)}
          onDelete={() => onDeleteChat(chat.id)}
        />
      ))}
    </div>
  );
};
