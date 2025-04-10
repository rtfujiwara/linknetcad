
import { Plan } from "@/types/plan";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { planManagerUtils } from "@/components/admin/managerUtils";

export const usePlansManager = (plans: Plan[], onAddPlan: (plan: Omit<Plan, "id">) => void, onDeletePlan: (id: number) => void) => {
  const [newPlan, setNewPlan] = useState<Omit<Plan, "id">>({
    name: "",
    price: 0,
    description: "",
  });
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
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

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
  };

  const handleUpdatePlan = () => {
    if (!editingPlan) return;
    
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
    planManagerUtils.savePlans(updatedPlans);
    
    // Show success toast
    toast({
      title: "Plano atualizado",
      description: "O plano foi atualizado com sucesso",
    });
    
    // Clear the editing state
    setEditingPlan(null);
  };

  const cancelEdit = () => {
    setEditingPlan(null);
  };

  return {
    newPlan,
    setNewPlan,
    editingPlan,
    setEditingPlan,
    handleSubmit,
    handleEdit,
    handleUpdatePlan,
    cancelEdit
  };
};
