import Cookies from 'js-cookie';
import { TokenPayload } from '@/resources/types/types';
import { jwtDecode } from 'jwt-decode';

export const sendMessage = async (message: string) => {
  try {
    const response = await fetch('https://ia-hope-0.azurewebsites.net/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message, init: false }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

export const saveTokenToCookie = (token: string) => {
  Cookies.set('access_token', token);

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
  Cookies.remove('access_token', {
    path: '/',
    domain: '.aimedic.com.co',
  });
};
