export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    email: string;
    name: string;
    password: string;
    projects: string[];
    paciente?: boolean;
    typeCancer?: string;
}

export interface AuthResponse {
    access_token: string;
}

export enum ProjectEnum {
    CARDIOPATIAS = 'cardiopatias',
    ACCESOS = 'accesos vasculares',
    COUNTRY = 'country',
}