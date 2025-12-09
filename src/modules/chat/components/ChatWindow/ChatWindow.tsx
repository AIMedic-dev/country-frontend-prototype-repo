import React from 'react';
import type { Message } from '../../types/chat.types';
import { ChatHeader } from '../ChatHeader/ChatHeader';
import { MessageList } from '../MessageList/MessageList';
import { ChatInput } from '../ChatInput/ChatInput';
import { EmptyChat } from '../EmptyChat/EmptyChat';
import styles from './ChatWindow.module.css';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onClearChat?: () => void;
  onMenuClick?: () => void;
  isLoading?: boolean;
  isSending?: boolean;
  streamingResponse?: string;
  isStreaming?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  onMenuClick,
  isLoading = false,
  isSending = false,
  streamingResponse = '',
  isStreaming = false,
}) => {
  const hasMessages = messages.length > 0;

  return (
    <div className={styles.chatWindow}>
      <ChatHeader
        messageCount={messages.length}
        onClear={hasMessages ? onClearChat : undefined}
        onMenuClick={onMenuClick}
      />

      {hasMessages || isStreaming ? (
        // Layout normal con mensajes
        <>
          <div className={styles.content}>
            <MessageList
              messages={messages}
              isLoading={isLoading}
              streamingResponse={streamingResponse}
              isStreaming={isStreaming}
            />
          </div>
          <ChatInput
            onSend={onSendMessage}
            disabled={isSending || isStreaming}
            placeholder={
              isStreaming
                ? 'Generando respuesta...'
                : isSending
                  ? 'Enviando...'
                  : 'preguntame algo ...'
            }
          />
        </>
      ) : (
        // Layout especial para EmptyChat con input integrado
        <div className={styles.emptyContainer}>
          <EmptyChat />
          <div className={styles.centeredInputWrapper}>
            <ChatInput
              onSend={onSendMessage}
              disabled={isSending || isStreaming}
              placeholder={
                isStreaming
                  ? 'Generando respuesta...'
                  : isSending
                    ? 'Enviando...'
                    : 'preguntame algo ...'
              }
              variant="centered"
            />
          </div>
        </div>
      )}
    </div>
  );
};