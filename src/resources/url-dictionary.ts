import { UrlEnum } from './types/types';

const URL: {
  [key in UrlEnum]: string;
} = {
  [UrlEnum.CARDIOPATIAS]: 'https://congenitas.aimedic.com.co',
  [UrlEnum.ACCESOS]: 'https://accesos.aimedic.com.co',
  [UrlEnum.LOGIN]: 'https://login.aimedic.com.co',
  [UrlEnum.COUNTRY]: 'https://COUNTRY.aimedic.com.co',
};

export default URL;
