
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
    <div className="bg-white rounded-lg shadow-lg p-6">
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
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeletePlan(plan.id)}
                >
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
