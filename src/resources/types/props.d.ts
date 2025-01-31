export type InputChatProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  waitingResponseBot: boolean;
};

export type ChatProps = {
  messages: Message[];
  send: (message: string) => void;
  waitingResponseBot: boolean;
  clearMessages: () => void;
};
