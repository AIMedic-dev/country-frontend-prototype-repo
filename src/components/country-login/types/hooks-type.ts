export interface FormValidation {
    isValid: boolean;
    errors: Record<string, string>;
}

export interface AuthState {
    isLoading: boolean;
    error: string | null;
    success: string | null;
}