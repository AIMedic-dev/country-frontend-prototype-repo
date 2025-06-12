import { UrlEnum } from '../types/enums';

const URL: {
  [key in UrlEnum]: string;
} = {
  [UrlEnum.CARDIOPATIAS]: 'https://congenitas.aimedic.com.co',
  [UrlEnum.ACCESOS]: 'https://accesos.aimedic.com.co',
  [UrlEnum.LOGIN]: 'https://login.aimedic.com.co',
  [UrlEnum.COUNTRY]: 'https://pacientes.aimedic.com.co',
};

export default URL;
