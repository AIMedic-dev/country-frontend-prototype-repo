import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  User,
  Bot,
  CheckCheck,
  Pin,
  PinOff,
  Menu,
  X,
} from 'lucide-react';
import ArtifactRenderer from '../artifact-render';
import MessageFeedback from '../message-feedback';
import TypingIndicator from '../typing-indicator';
import type { MessageType, Chat } from '../../types/general-types';
import ArtifactCompactIndicator from '../artifact-component-indicator';
import ReactMarkdown from 'react-markdown';
import WelcomeMessage from '../welcome-message';
import ConstructionFloat from '../construction-float';
import Input from '../input';
import ChatList from '../chat-list';

interface ChatCountryUIProps {
  messages: MessageType[];
  chats: Chat[];
  selectedChatId?: string;
  isLoading: boolean;
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  onSelectChat: (chatId: string) => void;
  onCreateNewChat: () => void;
  onSendMessage: (content: string) => Promise<boolean>;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  onToggleHighlight: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

// Función de utilidad para formatear fechas
// const formatMessageDate = (date: Date) => {
//   const now = new Date();
//   const messageDate = new Date(date);
//   const diffTime = Math.abs(now.getTime() - messageDate.getTime());
//   const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//   if (diffDays === 0) {
//     return 'Hoy';
//   } else if (diffDays === 1) {
//     return 'Ayer';
//   } else if (diffDays < 7) {
//     return `Hace ${diffDays} días`;
//   } else if (diffDays < 30) {
//     const weeks = Math.floor(diffDays / 7);
//     return weeks === 1 ? 'Hace 1 semana' : `Hace ${weeks} semanas`;
//   } else if (diffDays < 365) {
//     const months = Math.floor(diffDays / 30);
//     return months === 1 ? 'Hace 1 mes' : `Hace ${months} meses`;
//   } else {
//     const years = Math.floor(diffDays / 365);
//     return years === 1 ? 'Hace 1 año' : `Hace ${years} años`;
//   }
// };

// Función para agrupar mensajes por fecha
// const groupMessagesByDate = (messages: MessageType[]) => {
//   const groups: { [key: string]: MessageType[] } = {};

//   messages.forEach(message => {
//     const date = new Date(message.timestamp);
//     const dateKey = formatMessageDate(date);

//     if (!groups[dateKey]) {
//       groups[dateKey] = [];
//     }
//     groups[dateKey].push(message);
//   });

//   return groups;
// };

// Componente de Skeleton para mensajes
const MessageSkeleton = ({ isUser = false }) => (
  <div className={`mb-8 h-auto ${isUser ? 'flex justify-end' : ''}`}>
    <div
      className={`flex items-start space-x-6 ${
        isUser ? 'flex-row-reverse' : ''
      }`}
    >
      {/* Avatar Skeleton */}
      <div className="flex-shrink-0">
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse`}
        />
      </div>

      {/* Message Content Skeleton */}
      <div className={`max-w-lg ${isUser ? 'mr-3' : 'ml-3'}`}>
        <div className="space-y-3">
          {/* Message Header Skeleton */}
          <div className="flex items-center space-x-2">
            <div className="h-4 w-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded animate-pulse" />
          </div>

          {/* Message Body Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gradient-to-br from-gray-200 to-gray-300 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gradient-to-br from-gray-200 to-gray-300 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-gradient-to-br from-gray-200 to-gray-300 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Componente para el mensaje del bot
const BotMessage = ({
  message,
  onOpenArtifact,
}: {
  message: MessageType;
  onOpenArtifact: (artifact: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [hasOpenedArtifact, setHasOpenedArtifact] = useState(false);

  // Efecto para abrir automáticamente el artifact solo la primera vez
  useEffect(() => {
    if (message.hasArtifact && message.artifact && !hasOpenedArtifact) {
      onOpenArtifact(message.artifact);
      setHasOpenedArtifact(true);
    }
  }, [
    message.hasArtifact,
    message.artifact,
    onOpenArtifact,
    hasOpenedArtifact,
  ]);

  const togglePin = () => {
    setIsPinned(!isPinned);
  };

  return (
    <div className="flex items-start space-x-6 transition-all duration-500 ease-out">
      {/* Avatar mejorado */}
      <div className="flex-shrink-0 relative">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:rotate-3 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
          <Bot className="w-6 h-6 text-white relative z-10 drop-shadow-sm" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse">
            <Sparkles className="w-2.5 h-2.5 text-white absolute top-0.5 left-0.5" />
          </div>
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-gray-400/5 to-blue-500/5 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10 scale-105"></div>
      </div>
      {/* Message container mejorado */}
      <div className="flex-1 max-w-3xl">
        <div className="relative">
          {/* Background con glassmorphism mejorado */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-white/20 backdrop-blur-xl rounded-3xl rounded-tl-xl shadow-2xl border border-white/30"></div>
          {/* Subtle animated border */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/6 via-teal-300/4 to-cyan-400/6 rounded-3xl rounded-tl-xl opacity-0 group-hover:opacity-35 transition-opacity duration-500 blur-sm"></div>
          {/* Content */}
          <div className="relative px-6 py-4">
            {/* Botón de pin y timestamp */}
            <div className="flex items-center justify-between mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={togglePin}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                >
                  {isPinned ? (
                    <Pin className="w-4 h-4 text-blue-500" />
                  ) : (
                    <PinOff className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <span className="text-xs text-gray-400">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
            {/* Message text */}
            <div className="relative space-y-6">
              <div className="bg-white/50 rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                {message.content_short ? (
                  <>
                    <div className="whitespace-pre-wrap text-gray-600 leading-relaxed tracking-wide text-sm space-y-2">
                      <ReactMarkdown>{message.content_short}</ReactMarkdown>
                    </div>
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="mt-4 px-3 py-1.5 text-sm bg-white/50 hover:bg-white/80 text-gray-600 rounded-lg transition-all duration-300 flex items-center space-x-1.5 group border border-gray-200/50 hover:border-gray-300/50 shadow-sm hover:shadow-md"
                    >
                      <span className="font-medium">
                        {isExpanded
                          ? 'Ocultar respuesta completa'
                          : 'Ver respuesta completa'}
                      </span>
                      <svg
                        className={`w-3.5 h-3.5 transform transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        } text-gray-500 group-hover:text-gray-700`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="whitespace-pre-wrap text-gray-600 leading-relaxed tracking-wide text-sm space-y-2">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="whitespace-pre-wrap text-gray-600 leading-relaxed tracking-wide text-sm space-y-2">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>
              {message.hasArtifact && message.artifact && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ArtifactCompactIndicator
                    setCodeRendered={onOpenArtifact}
                    code={message.artifact}
                  />
                </div>
              )}
            </div>
            {/* MessageFeedback component con mejor hover */}
            <div className="mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-start">
              <MessageFeedback isBotMessage={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatCountryUI = ({
  messages,
  chats,
  selectedChatId,
  isLoading,
  //isLoadingChats,
  isLoadingMessages,
  onSelectChat,
  onCreateNewChat,
  onSendMessage,
  hasMore,
  onLoadMore,
  isLoadingMore,
  //onToggleHighlight,
  onDeleteChat,
}: ChatCountryUIProps) => {
  const [input, setInput] = useState('');
  const [codeArtifact, setCodeArtifact] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isConstructionVisible, setIsConstructionVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pinnedMessages, setPinnedMessages] = useState<Set<number>>(new Set());

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 140) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleSubmit = async () => {
    // Validaciones
    if (!input.trim()) {
      return;
    }
    if (isLoading) {
      return;
    }
    if (isLoadingMessages) {
      return;
    }
    if (!selectedChatId) {
      return;
    }

    try {
      // Limpiar el input inmediatamente
      setInput('');
      if (inputRef.current) {
        inputRef.current.style.height = '48px';
      }
      const success = await onSendMessage(input);
      console.log('Resultado del envío:', success);
    } catch (error) {
      console.error('Error en handleSubmit:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleOpenArtifact = (artifact: string) => {
    setCodeArtifact(artifact);
    setIsClosing(false);
    setIsSidebarOpen(false);
  };

  const handleCloseArtifact = () => {
    setIsClosing(true);
    // Esperar a que termine la animación antes de limpiar el artifact
    setTimeout(() => {
      setCodeArtifact('');
      setIsClosing(false);
    }, 300); // Ajustar este tiempo según la duración de tu animación
  };

  const togglePinMessage = (messageId: number) => {
    setPinnedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  // Agrupar mensajes por fecha fuera del JSX
  const groupedMessages = messages.reduce(
    (groups: { [key: string]: MessageType[] }, message) => {
      const date = new Date(message.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      let dateKey = '';
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Hoy';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Ayer';
      } else {
        const diffTime = Math.abs(today.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 7) {
          dateKey = `Hace ${diffDays} días`;
        } else if (diffDays < 30) {
          const weeks = Math.floor(diffDays / 7);
          dateKey = weeks === 1 ? 'Hace 1 semana' : `Hace ${weeks} semanas`;
        } else if (diffDays < 365) {
          const months = Math.floor(diffDays / 30);
          dateKey = months === 1 ? 'Hace 1 mes' : `Hace ${months} meses`;
        } else {
          const years = Math.floor(diffDays / 365);
          dateKey = years === 1 ? 'Hace 1 año' : `Hace ${years} años`;
        }
      }
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
      return groups;
    },
    {}
  );

  // Renderizado de mensajes agrupados
  const groupedMessagesJSX = Object.entries(groupedMessages).map(
    ([dateKey, dateMessages]) => (
      <div key={dateKey} className="mb-8">
        <div className="flex justify-center mb-6">
          <div className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm text-sm text-gray-600">
            {dateKey}
          </div>
        </div>
        {dateMessages.map((message, index) => (
          <div key={message.id || index} className="mb-8 h-auto group">
            {message.isMine ? (
              <div className="space-y-2">
                <div className="flex items-end space-x-3 justify-end">
                  <div className="relative max-w-lg">
                    <div className="flex items-center justify-end mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                      <button
                        onClick={() => togglePinMessage(message.id)}
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                      >
                        {pinnedMessages.has(message.id) ? (
                          <Pin className="w-4 h-4 text-blue-500" />
                        ) : (
                          <PinOff className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <span className="text-xs text-gray-400 mx-2">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      <CheckCheck className="w-3 h-3 text-blue-500" />
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white rounded-2xl rounded-br-md px-5 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                      <p className="whitespace-pre-wrap leading-relaxed text-sm relative z-10">
                        {message.content}
                      </p>
                      <div className="absolute -bottom-0 -right-0 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-blue-700"></div>
                    </div>
                    <div className="mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <MessageFeedback isBotMessage={false} />
                    </div>
                  </div>
                  <div className="flex-shrink-0 relative mt-4">
                    <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-30 scale-125 animate-pulse"></div>
                    <div
                      className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 opacity-50 animate-spin"
                      style={{ animationDuration: '3s' }}
                    ></div>
                    <div className="relative w-11 h-11 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 transform hover:scale-110 hover:rotate-6 border-2 border-white/30 backdrop-blur-sm">
                      <User className="w-5 h-5 text-white drop-shadow-lg" />
                      <div className="absolute -bottom-1 -right-1 flex space-x-0.5">
                        <div className="w-2 h-2 bg-green-400 border border-white rounded-full shadow-sm animate-pulse"></div>
                        <div
                          className="w-1.5 h-1.5 bg-blue-400 border border-white rounded-full shadow-sm animate-pulse"
                          style={{ animationDelay: '0.5s' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <BotMessage
                message={message}
                onOpenArtifact={handleOpenArtifact}
              />
            )}
          </div>
        ))}
      </div>
    )
  );

  return (
    <div className="flex w-full overflow-hidden h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => {
          const newSidebarState = !isSidebarOpen;
          setIsSidebarOpen(newSidebarState);
          if (newSidebarState && codeArtifact) {
            handleCloseArtifact();
          }
        }}
        className="fixed top-6 left-6 z-50 p-3 rounded-2xl bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-110 active:scale-95 group"
      >
        <div className="relative">
          {/* Efecto de brillo */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Icono con animación */}
          <div className="relative">
            {isSidebarOpen ? (
              <X className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300 transform group-hover:rotate-90" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300 transform group-hover:scale-110" />
            )}
          </div>

          {/* Tooltip */}
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            {isSidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
          </div>
        </div>
      </button>

      {/* Chat List Sidebar with animation */}
      <div
        className={`fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ChatList
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={onSelectChat}
          onCreateNewChat={onCreateNewChat}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          isLoadingMore={isLoadingMore}
          onDeleteChat={onDeleteChat}
        />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 h-screen flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 &&
              !isLoading &&
              !isLoadingMessages &&
              !selectedChatId && (
                <WelcomeMessage
                  onCreateNewChat={onCreateNewChat}
                  onSendMessage={onSendMessage}
                />
              )}

            {isLoadingMessages ? (
              <div className="space-y-8">
                <div className="flex justify-center mb-6">
                  <div className="h-8 w-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse" />
                </div>
                {[1, 2, 3, 4, 5].map(index => (
                  <MessageSkeleton key={index} isUser={index % 2 === 0} />
                ))}
              </div>
            ) : (
              <>
                {groupedMessagesJSX}
                {isLoading && (
                  <div className="mb-8 h-auto">
                    <div className="flex items-start space-x-6 transition-all duration-500 ease-out">
                      {/* Avatar del bot */}
                      <div className="flex-shrink-0 relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:rotate-3 transition-all duration-300 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
                          <Bot className="w-6 h-6 text-white relative z-10 drop-shadow-sm" />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse">
                            <Sparkles className="w-2.5 h-2.5 text-white absolute top-0.5 left-0.5" />
                          </div>
                        </div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-gray-400/5 to-blue-500/5 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10 scale-105"></div>
                      </div>
                      {/* Contenedor del mensaje */}
                      <div className="flex-1 max-w-3xl">
                        <div className="relative">
                          {/* Background con glassmorphism mejorado */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-white/20 backdrop-blur-xl rounded-3xl rounded-tl-xl shadow-2xl border border-white/30"></div>
                          {/* Subtle animated border */}
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/6 via-teal-300/4 to-cyan-400/6 rounded-3xl rounded-tl-xl opacity-0 group-hover:opacity-35 transition-opacity duration-500 blur-sm"></div>
                          {/* Content */}
                          <div className="relative px-6 py-4">
                            <TypingIndicator />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        {(selectedChatId || isLoading) && (
          <Input
            input={input}
            setInput={setInput}
            isLoading={isLoading || isLoadingMessages}
            setIsFocused={setIsFocused}
            isFocused={isFocused}
            setIsConstructionVisible={setIsConstructionVisible}
            inputRef={inputRef}
            handleSubmit={handleSubmit}
            handleKeyPress={handleKeyPress}
          />
        )}
      </div>

      {codeArtifact && (
        <div
          className={` h-full  w-1/2 ${
            isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
          }`}
        >
          {/* Fondo visual avanzado, solo efectos visuales */}
          <div className="absolute inset-0 z-0 pointer-events-none rounded-l-3xl bg-gradient-to-br from-white/80 via-blue-50/70 to-violet-100/80 backdrop-blur-2xl shadow-2xl overflow-hidden">
            {/* Glow radial animado en la esquina superior izquierda */}
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-gradient-radial from-cyan-300/40 via-violet-300/30 to-transparent rounded-full blur-3xl opacity-60 animate-pulse" />
            {/* Glow en el borde izquierdo */}
            <div className="absolute left-0 top-0 h-full w-3 bg-gradient-to-b from-cyan-300/40 via-violet-300/30 to-blue-300/40 blur-lg opacity-60 animate-pulse" />
            {/* Glow en el borde inferior */}
            <div className="absolute left-0 bottom-0 w-full h-2 bg-gradient-to-r from-cyan-200/30 via-blue-200/20 to-violet-200/30 blur-md opacity-40 animate-pulse" />
            {/* Glow en el borde derecho */}
            <div className="absolute right-0 top-0 h-full w-2 bg-gradient-to-b from-white/0 via-white/10 to-white/0 blur-md opacity-30" />
            {/* Partículas sutiles animadas */}
            <div className="absolute top-10 left-10 w-6 h-6 bg-cyan-200/30 rounded-full blur-2xl opacity-40 animate-float" />
            <div className="absolute bottom-16 left-24 w-4 h-4 bg-violet-200/30 rounded-full blur-xl opacity-30 animate-float-slow" />
            <div className="absolute top-1/2 right-10 w-5 h-5 bg-blue-200/30 rounded-full blur-xl opacity-30 animate-float" />
            <div className="absolute bottom-8 right-20 w-3 h-3 bg-cyan-100/30 rounded-full blur-lg opacity-20 animate-float-slow" />
          </div>
          {/* Botón y contenido original */}
          <button
            className="absolute cursor-pointer top-4 right-4 z-10 group overflow-hidden
            bg-gradient-to-br from-slate-100/80 via-white/70 to-slate-50/90 
            hover:from-violet-600 hover:via-blue-600 hover:to-cyan-500
            backdrop-blur-xl border border-white/40 hover:border-cyan-400/50
            text-slate-600 hover:text-white rounded-2xl p-3 transition-all duration-500 
            shadow-lg hover:shadow-2xl hover:shadow-cyan-500/40 hover:scale-110 
            transform-gpu will-change-transform active:scale-95"
            aria-label="Cerrar artifact"
            onClick={handleCloseArtifact}
          >
            <svg
              className="w-5 h-5 relative z-10 transition-all duration-300 ease-out
              group-hover:rotate-90 group-hover:scale-110 drop-shadow-sm
              group-active:rotate-180 group-active:scale-95"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
                className="transition-all duration-300 group-hover:stroke-[3] group-hover:drop-shadow-lg"
              />
            </svg>
          </button>
          <ArtifactRenderer code={codeArtifact} />
        </div>
      )}

      {isConstructionVisible && (
        <ConstructionFloat
          isVisible={isConstructionVisible}
          onClose={() => setIsConstructionVisible(false)}
        />
      )}
    </div>
  );
};

export default ChatCountryUI;
