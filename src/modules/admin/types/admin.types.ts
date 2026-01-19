export type UserRole = 'paciente' | 'empleado' | 'admin';

export interface BulkCreateUserInput {
  nombre: string;
  rol: UserRole;
  codigo: string;
}

export interface CreatedUser {
  id: string;
  nombre: string;
  rol: UserRole;
  codigo?: string;
  createdAt?: string;
  updatedAt?: string;
}

