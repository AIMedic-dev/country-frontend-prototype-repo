import React from 'react';
import type { Chat } from '../../types/chat.types';
import { ChatList } from '../ChatList/ChatList';
import styles from './ChatSidebar.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/modules/auth/context/AuthContext';


interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  isLoading?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChat,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  isLoading = false,
  isOpen = true,
  onClose,
}) => {

  const navigate = useNavigate();
  const { user, logout } = useAuthContext();


  const handleChatSelect = (chatId: string) => {
    onChatSelect(chatId);
    // Cerrar sidebar en mobile después de seleccionar
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Función para ir a estadísticas
  const handleGoToStatistics = () => {
    window.open('/statistics', '_blank', 'noopener,noreferrer');
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && onClose && (
        <div
          className={styles.overlay}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {/* Logos en la parte superior */}
        <div className={styles.logosContainer}>
          <img
            src="/images/logos/country-logo (1).png"
            alt="Country Logo"
            className={styles.logoCountry}
          />
          <div className={styles.logosDivider}>|</div>
          <img
            src="/images/logos/amedic-oscuro.svg"
            alt="Amedic Logo"
            className={styles.logoAimedic}
          />
        </div>

        {/* ✨ AGREGAR: Información del usuario */}
        {user && (
          <div className={styles.userInfo}>
            <div className={styles.userDetails}>
              <div className={styles.userAvatar}>
                {user.nombre.charAt(0).toUpperCase()}
              </div>
              <div className={styles.userText}>
                <p className={styles.userName}>{user.nombre}</p>
                <span className={styles.userRole}>
                  {user.rol === 'paciente' ? 'Paciente' : 'Empleado'}
                </span>
              </div>
            </div>
            <div className={styles.userActions}>
              {/* ✨ AGREGAR: Botón de estadísticas solo para empleados */}
              {user.rol === 'empleado' && (
                <button
                  className={styles.statsButton}
                  onClick={handleGoToStatistics}
                  aria-label="Ver estadísticas"
                  title="Ver estadísticas"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M3 17V10M10 17V3M17 17V7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}

              <button
                className={styles.logoutButton}
                onClick={handleLogout}
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M13 3H16C16.5304 3 17.0391 3.21071 17.4142 3.58579C17.7893 3.96086 18 4.46957 18 5V15C18 15.5304 17.7893 16.0391 17.4142 16.4142C17.0391 16.7893 16.5304 17 16 17H13M8 13L12 9M12 9L8 5M12 9H2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Header con botón de nuevo chat */}
        <div className={styles.header}>
          <h2 className={styles.title}>Conversaciones</h2>

          <div className={styles.headerButtons}>
            <button
              className={styles.newChatButton}
              onClick={onNewChat}
              aria-label="Nuevo chat"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {/* Botón de cerrar (solo visible en mobile) */}
            {onClose && (
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Cerrar menú"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Lista de chats */}
        <div className={styles.content}>
          <ChatList
            chats={chats}
            activeChat={activeChat}
            onChatSelect={handleChatSelect}
            onDeleteChat={onDeleteChat}
            isLoading={isLoading}
          />
        </div>
      </aside>
    </>
  );
};