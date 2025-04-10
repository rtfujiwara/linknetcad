
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plan } from "@/types/plan";

interface AddPlanFormProps {
  newPlan: Omit<Plan, "id">;
  onPlanChange: (plan: Omit<Plan, "id">) => void;
  onSubmit: () => void;
}

export const AddPlanForm = ({ newPlan, onPlanChange, onSubmit }: AddPlanFormProps) => {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="plan-name">Nome do Plano</Label>
          <Input
            id="plan-name"
            value={newPlan.name}
            onChange={(e) => onPlanChange({ ...newPlan, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plan-price">Preço</Label>
          <Input
            id="plan-price"
            type="number"
            value={newPlan.price}
            onChange={(e) => onPlanChange({ ...newPlan, price: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plan-description">Descrição</Label>
          <Input
            id="plan-description"
            value={newPlan.description}
            onChange={(e) => onPlanChange({ ...newPlan, description: e.target.value })}
          />
        </div>
      </div>
      <Button onClick={onSubmit} className="w-full mb-6">
        Adicionar Plano
      </Button>
    </>
  );
};
