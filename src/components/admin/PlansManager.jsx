import { useState } from "react";
import { PlanForm } from "./plans/PlanForm.jsx";
import { EditPlanForm } from "./plans/EditPlanForm.jsx";
import { PlansTable } from "./plans/PlansTable.jsx";

export const PlansManager = ({ plans, onAddPlan, onDeletePlan }) => {
  const [editingPlan, setEditingPlan] = useState(null);

  const handleEdit = (plan) => {
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
