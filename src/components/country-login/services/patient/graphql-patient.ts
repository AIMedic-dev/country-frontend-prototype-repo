// src/services/patient.ts
import authClient from './apollo-auth-patient';
import { gql } from '@apollo/client';
import type { UpdatePatientInputFront } from '../../types/types';


export const PATIENT_BY_USERNAME = gql`
  query PatientByUserName($userName: String!) {
    patientByUserName(userName: $userName) {
      userName
      status
      name
      city
      cancerType
      stage
    }
  }
`;

export const UPDATE_PATIENT_BY_USERNAME = gql`
  mutation UpdatePatientByUserName($userName: String!, $input: UpdatePatientInput!) {
    updatePatientByUserName(userName: $userName, input: $input) {
      status
    }
  }
`;

/* Obtener paciente */
export async function fetchPatientStatus(userName: string) {
  const { data } = await authClient.query({
    query: PATIENT_BY_USERNAME,
    variables: { userName },
    fetchPolicy: 'network-only',
  });
  return data.patientByUserName; // { status, ... }
}

/* Completar registro */
export async function completePatientRegister(
  userName: string,
  input: UpdatePatientInputFront,
) {
  return authClient.mutate({
    mutation: UPDATE_PATIENT_BY_USERNAME,
    variables: { userName, input },
  });
}
