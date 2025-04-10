
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users, CalendarDays } from "lucide-react";
import { ClientsTabContent } from "@/components/admin/dashboard/ClientsTabContent";
import { PlansTabContent } from "@/components/admin/dashboard/PlansTabContent";
import { UsersTabContent } from "@/components/admin/dashboard/UsersTabContent";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";

const AdminDashboard = () => {
  const {
    clients,
    editingClient,
    updatedClient,
    plans,
    handleEdit,
    handlePrint,
    handleDelete,
    handleSaveEdit,
    handleAddPlan,
    handleDeletePlan,
    setUpdatedClient
  } = useAdminDashboard();

  const { logout, isAdmin, hasPermission } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white relative overflow-hidden">
      {/* Efeito de fibra óptica */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.2)_0%,rgba(37,99,235,0.3)_100%)]"></div>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-[3px] bg-blue-500"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 100}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: Math.random() * 0.7 + 0.3,
              boxShadow: '0 0 15px rgba(59,130,246,0.8)',
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto py-8 relative">
        <DashboardHeader onLogout={logout} />

        <h1 className="text-2xl font-bold mb-4">Painel Administrativo</h1>
        
        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="clients" className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              Clientes
            </TabsTrigger>
            {(isAdmin || hasPermission("manage_plans")) && (
              <TabsTrigger value="plans" className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                Planos
              </TabsTrigger>
            )}
            {(isAdmin || hasPermission("manage_users")) && (
              <TabsTrigger value="users" className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Usuários
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="clients">
            <ClientsTabContent 
              clients={clients}
              editingClient={editingClient}
              updatedClient={updatedClient}
              handleEdit={handleEdit}
              handlePrint={handlePrint}
              handleDelete={handleDelete}
              handleSaveEdit={handleSaveEdit}
              setUpdatedClient={setUpdatedClient}
            />
          </TabsContent>
          
          {(isAdmin || hasPermission("manage_plans")) && (
            <TabsContent value="plans">
              <PlansTabContent 
                plans={plans}
                onAddPlan={handleAddPlan}
                onDeletePlan={handleDeletePlan}
              />
            </TabsContent>
          )}
          
          {(isAdmin || hasPermission("manage_users")) && (
            <TabsContent value="users">
              <UsersTabContent />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
