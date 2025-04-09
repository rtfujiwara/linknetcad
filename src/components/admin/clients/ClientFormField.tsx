
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClientFormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  maxLength?: number;
  placeholder?: string;
  handleCustomChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ClientFormField = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  maxLength,
  placeholder,
  handleCustomChange,
}: ClientFormFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (handleCustomChange) {
      handleCustomChange(e);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={handleChange}
        type={type}
        maxLength={maxLength}
        placeholder={placeholder}
      />
    </div>
  );
};
