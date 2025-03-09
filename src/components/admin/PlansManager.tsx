
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plan } from "@/types/plan";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface PlansManagerProps {
  plans: Plan[];
  onAddPlan: (plan: Omit<Plan, "id">) => void;
  onDeletePlan: (id: number) => void;
}

export const PlansManager = ({ plans, onAddPlan, onDeletePlan }: PlansManagerProps) => {
  const [newPlan, setNewPlan] = useState<Omit<Plan, "id">>({
    name: "",
    price: 0,
    description: "",
  });
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const { toast } = useToast();
  const { hasPermission } = useAuth();

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
    localStorage.setItem("plans", JSON.stringify(updatedPlans));
    
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {!editingPlan ? (
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
      ) : (
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
            <Button onClick={cancelEdit} variant="outline" className="flex-1">
              Cancelar
            </Button>
          </div>
        </>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell>{plan.name}</TableCell>
              <TableCell>R$ {plan.price.toFixed(2)}</TableCell>
              <TableCell>{plan.description}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {hasPermission("manage_plans") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(plan)}
                    >
                      Editar
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeletePlan(plan.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
