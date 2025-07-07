import { useState, useCallback } from 'react';
import type { AuthState } from '../types/hooks-type'; 

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
    success: null
  });

  const setLoading = useCallback((loading: boolean) => {
    setAuthState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setAuthState(prev => ({ ...prev, error, isLoading: false }));
  }, []);

  const setSuccess = useCallback((success: string | null) => {
    setAuthState(prev => ({ ...prev, success, isLoading: false }));
  }, []);

  const clearMessages = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null, success: null }));
  }, []);

  return {
    authState,
    setLoading,
    setError,
    setSuccess,
    clearMessages
  };
};