export type TokenPayload = {
  email: string;
  sub: string;
  projects: string[];
  iat: number;
  exp: number;
  userName?: string;
};

export enum UrlEnum {
  CARDIOPATIAS = 'cardiopatias',
  ACCESOS = 'accesos vasculares',
  LOGIN = 'login',
  COUNTRY = 'country',
}

export type Message = {
  message: string;
  isBot: boolean;
};

export type ChatContext = {
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  waitingResponseBot: boolean;
  setWaitingResponseBot: (waitingResponseBot: boolean) => void;
};
