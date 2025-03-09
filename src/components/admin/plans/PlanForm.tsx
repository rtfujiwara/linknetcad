
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plan } from "@/types/plan";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface PlanFormProps {
  onAddPlan: (plan: Omit<Plan, "id">) => void;
}

export const PlanForm = ({ onAddPlan }: PlanFormProps) => {
  const [newPlan, setNewPlan] = useState<Omit<Plan, "id">>({
    name: "",
    price: 0,
    description: "",
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!newPlan.name || newPlan.price <= 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
      });
      return;
    }
    onAddPlan(newPlan);
    setNewPlan({ name: "", price: 0, description: "" });
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="plan-name">Nome do Plano</Label>
          <Input
            id="plan-name"
            value={newPlan.name}
            onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plan-price">Preço</Label>
          <Input
            id="plan-price"
            type="number"
            value={newPlan.price}
            onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plan-description">Descrição</Label>
          <Input
            id="plan-description"
            value={newPlan.description}
            onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
          />
        </div>
      </div>
      <Button onClick={handleSubmit} className="w-full mb-6">
        Adicionar Plano
      </Button>
    </>
  );
};
