
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plan } from "@/types/plan";
import { useToast } from "@/components/ui/use-toast";

interface EditPlanFormProps {
  editingPlan: Plan;
  setEditingPlan: React.Dispatch<React.SetStateAction<Plan | null>>;
  plans: Plan[];
  onCancel: () => void;
}

export const EditPlanForm = ({
  editingPlan,
  setEditingPlan,
  plans,
  onCancel,
}: EditPlanFormProps) => {
  const { toast } = useToast();

  const handleUpdatePlan = () => {
    if (!editingPlan.name || editingPlan.price <= 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
      });
      return;
    }

    // Update the plan in the plans array
    const updatedPlans = plans.map((p) => 
      p.id === editingPlan.id ? editingPlan : p
    );
    
    // Save the updated plans to localStorage
    localStorage.setItem("plans", JSON.stringify(updatedPlans));
    
    // Show success toast
    toast({
      title: "Plano atualizado",
      description: "O plano foi atualizado com sucesso",
    });
    
    // Clear the editing state
    onCancel();
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Editar Plano</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="edit-plan-name">Nome do Plano</Label>
          <Input
            id="edit-plan-name"
            value={editingPlan.name}
            onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-plan-price">Preço</Label>
          <Input
            id="edit-plan-price"
            type="number"
            value={editingPlan.price}
            onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-plan-description">Descrição</Label>
          <Input
            id="edit-plan-description"
            value={editingPlan.description}
            onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
          />
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        <Button onClick={handleUpdatePlan} className="flex-1">
          Salvar Alterações
        </Button>
        <Button onClick={onCancel} variant="outline" className="flex-1">
          Cancelar
        </Button>
      </div>
    </>
  );
};
