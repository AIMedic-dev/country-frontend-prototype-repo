// src/lib/apolloAuth.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const authLink = createHttpLink({
  uri: 'backend-country.azurewebsites.net/api/v1/graphql',
});

const authClient = new ApolloClient({
  link: authLink,
  cache: new InMemoryCache(),
});

export default authClient;
