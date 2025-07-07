import client from './apollo-client';
import { gql } from '@apollo/client';
import type { LoginInput, RegisterInput, AuthResponse } from '../types/types'; // TODO: Cambiar a la ruta correcta

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginUserInput: { email: $email, password: $password }) {
      access_token
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation Signup(
    $email: String!
    $name: String!
    $password: String!
    $projects: [String!]!
    $paciente: Boolean
    $typeCancer: String
  ) {
    signup(
      input: {
        email: $email
        name: $name
        password: $password
        projects: $projects
        paciente: $paciente
        typeCancer: $typeCancer
      }
    ) {
      access_token
    }
  }
`;

export async function loginUser({ email, password }: LoginInput): Promise<AuthResponse> {
  const { data } = await client.mutate({
    mutation: LOGIN_MUTATION,
    variables: { email, password },
  });

  return data.login;
}

export async function registerUser(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await client.mutate({
    mutation: SIGNUP_MUTATION,
    variables: input,
  });

  return data.signup;
}
