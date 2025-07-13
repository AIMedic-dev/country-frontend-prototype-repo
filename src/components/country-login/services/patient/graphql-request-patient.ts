// src/services/auth.ts
import authClient from './apollo-auth-patient';
import { gql } from '@apollo/client';
import type { LoginInput, AuthResponse } from '../../types/types';


const LOGIN_PATIENT_MUTATION = gql`
  mutation LoginPatient($userName: String!, $code: String!) {
    loginPatient(userName: $userName, code: $code)
  }
`;

export async function loginPatient({ email, password }: LoginInput): Promise<AuthResponse> {
  const { data } = await authClient.mutate({
    mutation: LOGIN_PATIENT_MUTATION,
    variables: {
      userName: email,  // mapeo de campo
      code: password,   // mapeo de campo
    },
  });

  return {
    access_token: data.loginPatient,
  };
}
