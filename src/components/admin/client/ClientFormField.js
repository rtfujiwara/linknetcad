
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ClientFormField = ({
  id,
  label,
  children,
}) => {
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
