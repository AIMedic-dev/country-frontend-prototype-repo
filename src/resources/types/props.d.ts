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

export type ItemSideMenuProps = {
  title: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  iconName: string;
  selected: boolean;
};

export type SideMenuProps = {
  setShowMenu: (value: boolean) => void;
  showMenu: boolean;
};
