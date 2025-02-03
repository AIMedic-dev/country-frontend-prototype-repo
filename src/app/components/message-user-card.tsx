import { isMobile as detectedMobile } from 'react-device-detect';
import { useEffect, useState } from 'react';

const MessageUserCard = ({ message }: { message: string }) => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobile(detectedMobile);
  }, []);
  return (
    <div className="flex justify-end items-start space-x-2 pt-2 pb-2">
      <div className="break-words flex items-center  bg-blue-2 p-2 sm:p-1 sm:pr-2 sm:pl-2 max-w-[80%] rounded-l-lg rounded-br-lg">
        {message}
      </div>
      <span
        style={{
          fontSize: isMobile ? '26px' : '20px',
        }}
        className="material-icons text-blue-3 bg-blue-2/50 rounded-full p-1 sm:p-0.5"
      >
        person
      </span>
    </div>
  );
};

export default MessageUserCard;
