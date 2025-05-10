
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ValidationError } from "@/hooks/useFieldValidation";
import * as formatters from "@/utils/validations";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  required?: boolean;
  error?: ValidationError;
  formatOnBlur?: 'document' | 'cep' | 'phone';
  validateOnBlur?: 'document' | 'cep' | 'phone' | 'email' | 'required';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidate?: (field: string, value: string, type: 'document' | 'cep' | 'phone' | 'email' | 'required') => void;
}

const FormField = ({ 
  id, 
  label, 
  type = "text", 
  value, 
  required = false, 
  error, 
  formatOnBlur,
  validateOnBlur,
  onChange,
  onValidate
}: FormFieldProps) => {
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let formattedValue = e.target.value;
    
    // Aplicar formatação se necessário
    if (formatOnBlur && formattedValue) {
      switch (formatOnBlur) {
        case 'document':
          formattedValue = formatters.formatDocument(formattedValue);
          break;
        case 'cep':
          formattedValue = formatters.formatCEP(formattedValue);
          break;
        case 'phone':
          formattedValue = formatters.formatPhone(formattedValue);
          break;
      }
      
      // Atualizar o valor do campo com o valor formatado
      const event = {
        target: {
          id: e.target.id,
          value: formattedValue
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange(event);
    }
    
    // Validar campo se necessário
    if (validateOnBlur && onValidate) {
      onValidate(id, formattedValue || e.target.value, validateOnBlur);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        className={error?.hasError ? "border-red-500" : ""}
      />
      {error?.hasError && (
        <p className="text-red-500 text-xs mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default FormField;

