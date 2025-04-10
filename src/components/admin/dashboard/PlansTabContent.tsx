
import { Plan } from "@/types/plan";
import { PlansManager } from "@/components/admin/PlansManager";

interface PlansTabContentProps {
  plans: Plan[];
  onAddPlan: (plan: Omit<Plan, "id">) => void;
  onDeletePlan: (id: number) => void;
}

export function PlansTabContent({
  plans,
  onAddPlan,
  onDeletePlan
}: PlansTabContentProps) {
  return (
    <div className="space-y-4">
      <PlansManager 
        plans={plans}
        onAddPlan={onAddPlan}
        onDeletePlan={onDeletePlan}
      />
    </div>
  );
}
