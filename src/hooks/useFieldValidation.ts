
import { useState } from 'react';
import * as validators from '@/utils/validations';

export type ValidationError = {
  hasError: boolean;
  message: string;
};

export const useFieldValidation = () => {
  const [errors, setErrors] = useState<Record<string, ValidationError>>({});

  const validateField = (field: string, value: string, type: 'document' | 'cep' | 'phone' | 'email' | 'required') => {
    let isValid = true;
    let message = '';

    if (!value && type === 'required') {
      isValid = false;
      message = 'Este campo é obrigatório';
    } else if (value) {
      switch (type) {
        case 'document':
          isValid = validators.validateDocument(value);
          message = isValid ? '' : 'CPF/CNPJ inválido';
          break;
        case 'cep':
          isValid = validators.validateCEP(value);
          message = isValid ? '' : 'CEP inválido';
          break;
        case 'phone':
          isValid = validators.validatePhone(value);
          message = isValid ? '' : 'Telefone inválido';
          break;
        case 'email':
          isValid = validators.validateEmail(value);
          message = isValid ? '' : 'Email inválido';
          break;
        default:
          break;
      }
    }

    setErrors(prev => ({
      ...prev,
      [field]: { hasError: !isValid, message }
    }));

    return isValid;
  };

  const validateAll = (fields: {field: string, value: string, type: 'document' | 'cep' | 'phone' | 'email' | 'required'}[]): boolean => {
    let allValid = true;
    const newErrors: Record<string, ValidationError> = {};

    fields.forEach(({ field, value, type }) => {
      let isValid = true;
      let message = '';

      if (!value && type === 'required') {
        isValid = false;
        message = 'Este campo é obrigatório';
      } else if (value) {
        switch (type) {
          case 'document':
            isValid = validators.validateDocument(value);
            message = isValid ? '' : 'CPF/CNPJ inválido';
            break;
          case 'cep':
            isValid = validators.validateCEP(value);
            message = isValid ? '' : 'CEP inválido';
            break;
          case 'phone':
            isValid = validators.validatePhone(value);
            message = isValid ? '' : 'Telefone inválido';
            break;
          case 'email':
            isValid = validators.validateEmail(value);
            message = isValid ? '' : 'Email inválido';
            break;
          default:
            break;
        }
      }

      newErrors[field] = { hasError: !isValid, message };
      if (!isValid) allValid = false;
    });

    setErrors(newErrors);
    return allValid;
  };

  const clearErrors = () => {
    setErrors({});
  };

  return { errors, validateField, validateAll, clearErrors };
};

