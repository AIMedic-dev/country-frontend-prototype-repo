'use client';

import { createContext, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import URL from '@/resources/url-dictionary';
import { createApolloClient } from '@/services/apollo-client';
import { ApolloProvider } from '@apollo/client';
import {
  removeToken,
  getTokenFromCookie,
  decodeToken,
  saveTokenToCookie,
} from '@/resources/functions';

// Crear el contexto de autenticación
const AuthContext = createContext({ logout: () => {} });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    // saveTokenToCookie(
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBhY2llbnRlMzNAZ21haWwuY29tIiwic3ViIjoiNjdkNGQ3MDg2YzgxZGU5Y2ZhNWMyMTg1IiwicHJvamVjdHMiOlsiY291bnRyeSJdLCJ1c2VyTmFtZSI6ImFpbWVkaWMiLCJyb2xlIjoicGFjaWVudGUiLCJ0eXBlQ2FuY2VyIjoiY2FuY2VydHlwZSIsImlhdCI6MTc0MjAxMDI3OSwiZXhwIjoxNzQyNjE1MDc5fQ.QmxC7zetsb8s6ZSDNEtHbWN4rRGNHoMpPYCJohPzAd0'
    // );
    const token = getTokenFromCookie();
    if (!token) {
      router.replace(URL.login);
    } else {
      const decodedToken = decodeToken(token);

      if (decodedToken) {
        const projects = decodedToken.projects;
        if (!projects.includes('country')) {
          router.replace(URL.login);
        }
      }
    }
  }, []);

  const logout = () => {
    removeToken();

    const token = getTokenFromCookie();
    if (!token) {
      router.replace(URL.login);
    }
  };

  const client = createApolloClient(logout);

  return (
    <AuthContext.Provider value={{ logout }}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useAuth = () => useContext(AuthContext);
