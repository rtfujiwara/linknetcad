
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";

export const PlansTable = ({ plans, onDeletePlan, onEditPlan }) => {
  const { hasPermission } = useAuth();

  return (
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
                    onClick={() => onEditPlan(plan)}
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
  );
};
