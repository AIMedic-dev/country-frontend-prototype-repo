'use client';
import NavBar from '../components/nav-bar';
import { useState, useEffect, useRef } from 'react';
import InputChat from '../components/input-chat';
import MessageBotCard from '../components/message-bot-card';
import MessageUserCard from '../components/message-user-card';
import { ChatProps } from '@/resources/types/props';
import { DotLoader } from 'react-spinners';
import { colors } from '@/resources/colors';

const ChatPresentation: React.FC<ChatProps> = ({
  messages,
  send,
  waitingResponseBot,
  clearMessages,
}) => {
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chatContainerRef.current) return;

    const chatContainer = chatContainerRef.current;
    const isAtBottom =
      chatContainer.scrollHeight - chatContainer.scrollTop <=
      chatContainer.clientHeight + 50;

    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, waitingResponseBot]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSend = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    send(input);
    setInput('');
  };

  return (
    <div className="absolute h-screen flex flex-col items-center w-full  text-base">
      <NavBar />
      <div className="flex flex-grow h-[80%] flex-col text-sm w-11/12 p-3 pt-5 pr-1 pl-1 bg-blue-1 rounded-3xl border-2 border-blue-2 shadow-layout mt-2 mb-6 sm:w-10/12">
        <div className="w-full text-base h-full pr-2 pl-2 sm:pr-10 sm:pl-10  overflow-y-auto mb-6">
          <div
            ref={chatContainerRef}
            className="flex justify-end items-center pr-2 sm:pr-0 cursor-pointer"
          >
            <span
              onClick={clearMessages}
              style={{
                fontSize: '25px',
              }}
              className="material-icons text-blue-3"
            >
              clear_all
            </span>
          </div>
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
        <div className="flex items-center justify-center w-full flex-shrink-0">
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
