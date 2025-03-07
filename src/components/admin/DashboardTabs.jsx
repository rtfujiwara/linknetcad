import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ClientsTable } from "@/components/admin/ClientsTable";
import { PlansManager } from "@/components/admin/PlansManager";
import { UsersManager } from "@/components/admin/UsersManager";

export const DashboardTabs = ({
  clients,
  plans,
  hasManagePlansPermission,
  hasManageUsersPermission,
  hasEditClientsPermission,
  hasPrintClientsPermission,
  hasDeletePermission,
  onEditClient,
  onPrintClient,
  onDeleteClient,
  onAddPlan,
  onDeletePlan,
}) => {
  return (
    <Tabs defaultValue="clients" className="space-y-4">
      <TabsList className="bg-white/50">
        <TabsTrigger value="clients" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-900">
          Clientes
        </TabsTrigger>
        {hasManagePlansPermission && (
          <TabsTrigger value="plans" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-900">
            Planos
          </TabsTrigger>
        )}
        {hasManageUsersPermission && (
          <TabsTrigger value="users" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-900">
            Usuários
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="clients">
        <ClientsTable
          clients={clients}
          onEdit={client => hasEditClientsPermission && onEditClient(client)}
          onPrint={client => hasPrintClientsPermission && onPrintClient(client)}
          onDelete={hasDeletePermission ? onDeleteClient : undefined}
        />
      </TabsContent>

      <TabsContent value="plans">
        <PlansManager
          plans={plans}
          onAddPlan={onAddPlan}
          onDeletePlan={onDeletePlan}
        />
      </TabsContent>

      <TabsContent value="users">
        <UsersManager />
      </TabsContent>
    </Tabs>
  );
};
