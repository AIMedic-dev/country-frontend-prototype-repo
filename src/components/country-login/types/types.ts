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


export interface UpdatePatientInputFront {
    name?: string;
    city?: string;
    cancerType?: string;
    stage?: string;
    status?: 'ACTIVE' | 'INACTIVE';
  }
  

// export enum ProjectEnum {
//     CARDIOPATIAS = 'cardiopatias',
//     ACCESOS = 'accesos vasculares',
//     COUNTRY = 'country',
// }