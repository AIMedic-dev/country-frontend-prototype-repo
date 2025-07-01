import Cookies from 'js-cookie';
import type { TokenPayload } from '../types/general-types';
import { jwtDecode } from 'jwt-decode';

export const saveTokenToCookie = (token: string) => {
  Cookies.set('access_token', token, { path: '/' });
  return token;
};

export const getTokenFromCookie = () => {
  const token = Cookies.get('access_token');
  return token;
};

export const decodeToken = (token: string): TokenPayload | void => {
  if (token) {
    return jwtDecode(token);
  }
};

export const removeToken = () => {
  Cookies.remove('access_token', { path: '/' });
};
