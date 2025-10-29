import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Message } from '../../types/chat.types';
import { MessageBubble } from '../MessageBubble/MessageBubble';
import { Spinner } from '../../../../shared';
import styles from './MessageList.module.css';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  streamingResponse?: string;
  isStreaming?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading = false,
  streamingResponse = '',
  isStreaming = false,
}) => {
  const messageListRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);

  // 🔥 SCROLL FORZADO cuando hay un mensaje NUEVO
  useEffect(() => {
    // Solo hacer scroll si aumentó el número de mensajes
    if (messages.length > prevMessagesLengthRef.current) {
      prevMessagesLengthRef.current = messages.length;
      
      // Esperar a que React termine de renderizar + un poco más
      const scrollTimer = setTimeout(() => {
        if (messageListRef.current) {
          const container = messageListRef.current;
          
          // FORZAR scroll al final
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
          
          // Por si acaso, hacerlo de nuevo
          setTimeout(() => {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: 'smooth'
            });
          }, 100);
        }
      }, 300); // Delay más largo para asegurar que el DOM esté listo

      return () => clearTimeout(scrollTimer);
    }
  }, [messages.length]); // Solo cuando cambia la cantidad

  // Scroll durante streaming
  useEffect(() => {
    if (isStreaming && streamingResponse && messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [streamingResponse, isStreaming]);

  if (isLoading && messages.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="lg" color="primary" />
        <p className={styles.loadingText}>Cargando mensajes...</p>
      </div>
    );
  }

  return (
    <div ref={messageListRef} className={styles.messageList}>
      <div className={styles.messagesContainer}>
        {messages.map((message, index) => (
          <MessageBubble
            key={`${message.timestamp}-${index}`}
            content={message.content}
            answer={message.answer}
            timestamp={message.timestamp}
          />
        ))}

        {isStreaming && (
          <div className={styles.streamingContainer}>
            <div className={styles.aiAvatar}>
              <img
                src="/images/logos/country-icono.png"
                alt="Country"
                width="24"
                height="24"
              />
            </div>

            <div className={styles.streamingContent}>
              {streamingResponse ? (
                <div className={styles.markdown}>
                  <ReactMarkdown>{streamingResponse}</ReactMarkdown>
                  <span className={styles.cursor}>▊</span>
                </div>
              ) : (
                <div className={styles.thinkingDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};