import { InputChatProps } from '@/resources/types/props';
import { useState, useEffect, useRef } from 'react';
import { DotLoader } from 'react-spinners';
import { colors } from '@/resources/colors';

const InputChat: React.FC<InputChatProps> = ({
  value,
  onChange,
  onSend,
  waitingResponseBot,
}) => {
  const [focus, setFocus] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaHeight, setTextAreaHeight] = useState<number>(0);

  useEffect(() => {
    if (
      value &&
      value.trim() !== '' &&
      value.trim().length > 0 &&
      !waitingResponseBot
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [value, waitingResponseBot]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      if (textAreaRef.current.offsetHeight !== textAreaHeight) {
        setTextAreaHeight(textAreaRef.current.offsetHeight);
      }
    }
  }, [value, textAreaHeight]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      onSend(e as any);
    }
  };

  return (
    <section
      className={`p-1.5 w-11/12 lg:w-10/12   pl-3 space-x-2 items-center shadow-input justify-center flex flex-row rounded-3xl ${focus ? 'bg-blue-2' : 'bg-blue-2/70'}`}
    >
      <textarea
        value={value}
        onChange={onChange}
        placeholder="Escribe un mensaje..."
        className="w-full  flex items-center resize-none max-h-40  bg-transparent outline-none placeholder-white-1/30"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        rows={1}
        ref={textAreaRef}
        onKeyDown={onKeyDown}
      />
      <button
        disabled={disabled}
        onClick={onSend}
        className={`flex items-center ${disabled ? '' : 'bg-pink-1 shadow-default hover:bg-pink-1/80 focus:shadow-focus'} mt-auto justify-center p-1.5  rounded-full `}
      >
        {!waitingResponseBot ? (
          <span
            style={{}}
            className={`material-icons ${disabled ? 'text-white-1/0' : 'text-white-1'}`}
          >
            send
          </span>
        ) : (
          <DotLoader color={colors.pink[1]} size={23} />
        )}
      </button>
    </section>
  );
};

export default InputChat;
