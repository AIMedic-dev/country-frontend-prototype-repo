import { useState, useCallback } from 'react';
import type { FormValidation } from '../types/hooks-type';

export const useFormValidation = () => {
  const [validation, setValidation] = useState<FormValidation>({
    isValid: true,
    errors: {}
  });

  const validateEmail = useCallback((email: string): string | null => {
    const emailRegex = /^[^\s@]+@clinicadelcountry\.com$/;
    if (!email) return 'El correo es obligatorio';
    if (!emailRegex.test(email)) return 'Solo se permiten correos @clinicadelcountry.com';
    return null;
  }, []);

  const validatePassword = useCallback((password: string): string | null => {
    if (!password) return 'La contraseña es obligatoria';
    if (password.length < 8) return 'Debe tener al menos 8 caracteres';
    if (!/(?=.*[a-z])/.test(password)) return 'Debe incluir al menos una letra minúscula';
    if (!/(?=.*[A-Z])/.test(password)) return 'Debe incluir al menos una letra mayúscula';
    if (!/(?=.*\d)/.test(password)) return 'Debe incluir al menos un número';
    return null;
  }, []);

  const validateRequired = useCallback((value: string, fieldName: string): string | null => {
    if (!value || value.trim() === '') return `${fieldName} es obligatorio`;
    return null;
  }, []);

  const validateConfirmPassword = useCallback((password: string, confirmPassword: string): string | null => {
    if (!confirmPassword) return 'Confirma tu contraseña';
    if (password !== confirmPassword) return 'Las contraseñas no coinciden';
    return null;
  }, []);

  const validateAuthCode = useCallback((code: string): string | null => {
    if (!code) return 'El código es obligatorio';
    if (!/^\d{6}$/.test(code)) return 'El código debe tener 6 dígitos numéricos';
    return null;
  }, []);

  const setFieldError = useCallback((fieldName: string, error: string | null) => {
    setValidation(prev => ({
      isValid: error ? false : Object.keys(prev.errors).filter(key => key !== fieldName).length === 0,
      errors: error 
        ? { ...prev.errors, [fieldName]: error }
        : Object.fromEntries(Object.entries(prev.errors).filter(([key]) => key !== fieldName))
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setValidation({ isValid: true, errors: {} });
  }, []);

  return {
    validation,
    validateEmail,
    validatePassword,
    validateRequired,
    validateConfirmPassword,
    validateAuthCode,
    setFieldError,
    clearErrors
  };
};