// lib/apollo-client.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getTokenFromCookie } from '@/resources/functions';
import { removeToken } from '@/resources/functions';

// Definición del enlace HTTP con la URL del servidor GraphQL
const httpLink = createHttpLink({
  uri: 'https://backend-country.azurewebsites.net/api/v1/graphql',
});

// Enlace de autenticación para añadir el token a las cabeceras de las solicitudes
const authLink = setContext((_, { headers }) => {
  const token = getTokenFromCookie();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// 🔥 Exportamos una función que recibe `onLogout`
export const createApolloClient = (onLogout: () => void) => {
  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) => {
        if (message.includes('Token inválido')) {
          removeToken();
          onLogout();
        }
      });
    }
  });

  return new ApolloClient({
    link: errorLink.concat(authLink).concat(httpLink),
    cache: new InMemoryCache(),
  });
};
