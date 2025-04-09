
import { useState, useEffect } from "react";
import { ClientsTable } from "@/components/admin/ClientsTable";
import { EditClientModal } from "@/components/admin/EditClientModal";
import { Client } from "@/types/client";
import { useToast } from "@/components/ui/use-toast";
import { printClient } from "@/utils/printClient";
import { syncStorage } from "@/utils/syncStorage";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { LogOut, Users, FileText, CalendarDays } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlansManager } from "@/components/admin/PlansManager";
import { UsersManager } from "@/components/admin/UsersManager";
import { Plan } from "@/types/plan";
import { userManagerUtils, planManagerUtils } from "@/components/admin/managerUtils";

const AdminDashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [updatedClient, setUpdatedClient] = useState<Client | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const { toast } = useToast();
  const { logout, isAdmin, hasPermission } = useAuth();

  useEffect(() => {
    loadClients();
    loadPlans();
  }, []);

  const loadClients = () => {
    const savedClients = syncStorage.getItem<Client[]>("clients", []);
    setClients(savedClients);
  };

  const loadPlans = () => {
    const savedPlans = planManagerUtils.getPlans();
    setPlans(savedPlans);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setUpdatedClient(client);
  };

  const handlePrint = (client: Client) => {
    printClient(client);
  };

  const handleDelete = (client: Client) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${client.name}?`)) {
      const updatedClients = clients.filter((c) => c.id !== client.id);
      syncStorage.setItem("clients", updatedClients);
      setClients(updatedClients);
      toast({
        title: "Cliente excluído",
        description: "O cliente foi removido com sucesso.",
      });
    }
  };

  const handleSaveEdit = (client: Client) => {
    const updatedClients = clients.map((c) => 
      c.id === client.id ? client : c
    );
    syncStorage.setItem("clients", updatedClients);
    setClients(updatedClients);
    setEditingClient(null);
    setUpdatedClient(null);
    toast({
      title: "Cliente atualizado",
      description: "As informações do cliente foram atualizadas com sucesso.",
    });
  };

  const handleAddPlan = (plan: Omit<Plan, "id">) => {
    const newPlan: Plan = {
      id: Date.now(),
      ...plan,
    };
    const updatedPlans = [...plans, newPlan];
    planManagerUtils.savePlans(updatedPlans);
    setPlans(updatedPlans);
    toast({
      title: "Plano adicionado",
      description: "O plano foi adicionado com sucesso.",
    });
  };

  const handleDeletePlan = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este plano?")) {
      const updatedPlans = plans.filter((p) => p.id !== id);
      planManagerUtils.savePlans(updatedPlans);
      setPlans(updatedPlans);
      toast({
        title: "Plano excluído",
        description: "O plano foi removido com sucesso.",
      });
    }
  };

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
        <header className="flex justify-between items-center mb-8">
          <Link to="/">
            <img
              src="/lovable-uploads/d03abdb3-b61b-43e7-b5d4-4983ff5fcf27.png"
              alt="Linknet Vale Logo"
              className="w-32 md:w-40"
            />
          </Link>
          <div className="flex gap-2">
            <Button onClick={logout} variant="outline" className="flex items-center gap-1">
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </header>

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
          
          <TabsContent value="clients" className="space-y-4">
            <ClientsTable
              clients={clients}
              onEdit={handleEdit}
              onPrint={handlePrint}
              onDelete={handleDelete}
            />
          </TabsContent>
          
          {(isAdmin || hasPermission("manage_plans")) && (
            <TabsContent value="plans" className="space-y-4">
              <PlansManager 
                plans={plans}
                onAddPlan={handleAddPlan}
                onDeletePlan={handleDeletePlan}
              />
            </TabsContent>
          )}
          
          {(isAdmin || hasPermission("manage_users")) && (
            <TabsContent value="users" className="space-y-4">
              <UsersManager />
            </TabsContent>
          )}
        </Tabs>
        
        {editingClient && updatedClient && (
          <EditClientModal
            client={updatedClient}
            onSave={handleSaveEdit}
            onCancel={() => setEditingClient(null)}
            onChange={(updatedClient) => setUpdatedClient(updatedClient)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
