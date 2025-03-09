
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

interface ClientFormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
}

export const ClientFormField = ({
  id,
  label,
  children,
}: ClientFormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
};

export const ClientInput = ({
  id,
  value,
  onChange,
  type = "text",
  maxLength,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  maxLength?: number;
  placeholder?: string;
}) => {
  return (
    <Input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      placeholder={placeholder}
    />
  );
};

