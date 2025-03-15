'use client';
import { ApolloProvider } from '@apollo/client';
import { useAuth } from '@/app/components/auth-context';
import { createApolloClient } from '@/services/apollo-client';
import React, { ReactNode } from 'react';

const ApolloProviderWrapper: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { logout } = useAuth(); // ✅ Ahora `onLogout` se obtiene de React correctamente
  const client = createApolloClient(logout);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloProviderWrapper;
