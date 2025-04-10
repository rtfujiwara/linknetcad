
import { Plan } from "@/types/plan";
import { usePlansManager } from "./plans/usePlansManager";
import { AddPlanForm } from "./plans/AddPlanForm";
import { EditPlanForm } from "./plans/EditPlanForm";
import { PlansTable } from "./plans/PlansTable";

interface PlansManagerProps {
  plans: Plan[];
  onAddPlan: (plan: Omit<Plan, "id">) => void;
  onDeletePlan: (id: number) => void;
}

export const PlansManager = ({ plans, onAddPlan, onDeletePlan }: PlansManagerProps) => {
  const {
    newPlan,
    setNewPlan,
    editingPlan,
    handleSubmit,
    handleEdit,
    handleUpdatePlan,
    cancelEdit,
    setEditingPlan
  } = usePlansManager(plans, onAddPlan, onDeletePlan);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {!editingPlan ? (
        <AddPlanForm 
          newPlan={newPlan} 
          onPlanChange={setNewPlan} 
          onSubmit={handleSubmit} 
        />
      ) : (
        <EditPlanForm 
          editingPlan={editingPlan} 
          onPlanChange={setEditingPlan} 
          onSave={handleUpdatePlan} 
          onCancel={cancelEdit} 
        />
      )}

      <PlansTable 
        plans={plans} 
        onEdit={handleEdit} 
        onDelete={onDeletePlan} 
      />
    </div>
  );
};
