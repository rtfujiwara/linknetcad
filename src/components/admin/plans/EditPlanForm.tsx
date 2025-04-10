
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plan } from "@/types/plan";

interface EditPlanFormProps {
  editingPlan: Plan;
  onPlanChange: (plan: Plan) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const EditPlanForm = ({ editingPlan, onPlanChange, onSave, onCancel }: EditPlanFormProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Editar Plano</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="edit-plan-name">Nome do Plano</Label>
          <Input
            id="edit-plan-name"
            value={editingPlan.name}
            onChange={(e) => onPlanChange({ ...editingPlan, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-plan-price">Preço</Label>
          <Input
            id="edit-plan-price"
            type="number"
            value={editingPlan.price}
            onChange={(e) => onPlanChange({ ...editingPlan, price: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-plan-description">Descrição</Label>
          <Input
            id="edit-plan-description"
            value={editingPlan.description}
            onChange={(e) => onPlanChange({ ...editingPlan, description: e.target.value })}
          />
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        <Button onClick={onSave} className="flex-1">
          Salvar Alterações
        </Button>
        <Button onClick={onCancel} variant="outline" className="flex-1">
          Cancelar
        </Button>
      </div>
    </>
  );
};
