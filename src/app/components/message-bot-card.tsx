import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

const MessageBotCard = ({ message }: { message: string }) => {
  return (
    <div className="flex items-start space-x-2 pt-2 pb-2">
      <Image
        src="/icons/aimedic-icono-blanco.svg"
        alt="icono aimedic"
        width={50}
        height={50}
        className="w-7 sm:w-5"
      />
      <div className="break-words  max-w-[80%] pt-1">
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
    </div>
  );
};

export default MessageBotCard;
