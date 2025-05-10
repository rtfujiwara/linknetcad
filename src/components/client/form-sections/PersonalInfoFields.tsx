
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ClientData } from "@/types/client";

interface PersonalInfoFieldsProps {
  formData: ClientData;
  setFormData: React.Dispatch<React.SetStateAction<ClientData>>;
}

const PersonalInfoFields = ({ formData, setFormData }: PersonalInfoFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail *</Label>
        <Input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="document">CPF / CNPJ *</Label>
        <Input
          id="document"
          required
          value={formData.document}
          onChange={(e) => setFormData({ ...formData, document: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rgIe">RG / IE *</Label>
        <Input
          id="rgIe"
          required
          value={formData.rgIe}
          onChange={(e) => setFormData({ ...formData, rgIe: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthDate">Data de Nascimento *</Label>
        <Input
          id="birthDate"
          type="date"
          required
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
        />
      </div>
    </>
  );
};

export default PersonalInfoFields;
