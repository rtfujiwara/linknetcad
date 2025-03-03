
import { Plan } from "@/types/plan";
import { useState } from "react";
import { PlanForm } from "./plans/PlanForm";
import { EditPlanForm } from "./plans/EditPlanForm";
import { PlansTable } from "./plans/PlansTable";

interface PlansManagerProps {
  plans: Plan[];
  onAddPlan: (plan: Omit<Plan, "id">) => void;
  onDeletePlan: (id: number) => void;
}

export const PlansManager = ({ plans, onAddPlan, onDeletePlan }: PlansManagerProps) => {
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
  };

  const cancelEdit = () => {
    setEditingPlan(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {!editingPlan ? (
        <PlanForm onAddPlan={onAddPlan} />
      ) : (
        <EditPlanForm 
          editingPlan={editingPlan}
          setEditingPlan={setEditingPlan}
          plans={plans}
          onCancel={cancelEdit}
        />
      )}

      <PlansTable 
        plans={plans} 
        onDeletePlan={onDeletePlan} 
        onEditPlan={handleEdit} 
      />
    </div>
  );
};
