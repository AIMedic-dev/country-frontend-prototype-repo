'use client';

import { useState, useEffect, useRef } from 'react';
import InputChat from '../components/input-chat';
import MessageBotCard from '../components/message-bot-card';
import MessageUserCard from '../components/message-user-card';
import { ChatProps } from '@/resources/types/props';
import { DotLoader } from 'react-spinners';
import { colors } from '@/resources/colors';
import { isMobile as detectedMobile } from 'react-device-detect';

const ChatPresentation: React.FC<ChatProps> = ({
  messages,
  send,
  waitingResponseBot,
  clearMessages,
}) => {
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobile(detectedMobile);
  }, []);
  useEffect(() => {
    if (!chatContainerRef.current) return;

    const isAtBottom =
      chatContainerRef.current.scrollHeight -
        chatContainerRef.current.clientHeight <=
      chatContainerRef.current.scrollTop;

    if (!isAtBottom) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight -
        chatContainerRef.current.clientHeight;
    }
  }, [messages]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSend = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    send(input);
    setInput('');
  };

  return (
    <div
      className={` flex  h-full flex-col items-center w-full overflow-hidden `}
    >
      {/* contenedor que representa el chat completo */}
      <div className="flex overflow-hidden h-full flex-col w-11/12 md:w-9/12 lg:w-8/12 py-3 bg-blue-1 rounded-3xl border-2 border-blue-2 shadow-layout my-4">
        {/* contenedor que representa la sección de botones superiores */}
        <div className="flex justify-start sm:justify-end items-center w-full px-3">
          <span
            onClick={clearMessages}
            style={{
              fontSize: isMobile ? '30px' : '24px',
            }}
            className={`material-icons select-none ${
              messages.length > 1 && !waitingResponseBot
                ? 'text-blue-3 cursor-pointer '
                : 'text-transparent'
            }`}
          >
            clear_all
          </span>
        </div>

        {/* zona de mensajes del chat */}
        <div
          ref={chatContainerRef}
          className="scrollbar-thin scrollbar-thumb-blue-2/50 scrollbar-track-blue-1 w-full h-full px-3 sm:px-6  overflow-y-auto space-y-2"
        >
          {messages.map((message, index) =>
            message.isBot ? (
              <MessageBotCard key={index} message={message.message} />
            ) : (
              <MessageUserCard key={index} message={message.message} />
            )
          )}
          {waitingResponseBot && <DotLoader color={colors.blue[3]} size={30} />}

          <div ref={messagesEndRef} />
        </div>

        {/* contenedor para centrar el input principal del chat */}
        <div className="flex items-center justify-center w-full">
          <InputChat
            value={input}
            onChange={handleChangeInput}
            onSend={handleSend}
            waitingResponseBot={waitingResponseBot}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPresentation;
