
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ClientData } from "@/types/client";

interface ContactFieldsProps {
  formData: ClientData;
  setFormData: React.Dispatch<React.SetStateAction<ClientData>>;
}

const ContactFields = ({ formData, setFormData }: ContactFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone *</Label>
        <Input
          id="phone"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="alternativePhone">Telefone Recado</Label>
        <Input
          id="alternativePhone"
          value={formData.alternativePhone}
          onChange={(e) => setFormData({ ...formData, alternativePhone: e.target.value })}
        />
      </div>
    </div>
  );
};

export default ContactFields;
