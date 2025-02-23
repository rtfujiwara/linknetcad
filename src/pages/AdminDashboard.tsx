
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ClientsTable } from "@/components/admin/ClientsTable";
import { PlansManager } from "@/components/admin/PlansManager";
import { EditClientModal } from "@/components/admin/EditClientModal";
import { printClient } from "@/utils/printClient";
import { Client } from "@/types/client";
import { Plan } from "@/types/plan";

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
      return;
    }
    const savedClients = JSON.parse(localStorage.getItem("clients") || "[]");
    const savedPlans = JSON.parse(localStorage.getItem("plans") || "[]");
    setClients(savedClients);
    setPlans(savedPlans);
  }, [isAuthenticated, navigate]);

  const handleAddPlan = (newPlan: Omit<Plan, "id">) => {
    const plan = {
      ...newPlan,
      id: Date.now(),
    };
    const updatedPlans = [...plans, plan];
    setPlans(updatedPlans);
    localStorage.setItem("plans", JSON.stringify(updatedPlans));
    toast({
      title: "Plano adicionado",
      description: "O novo plano foi cadastrado com sucesso",
    });
  };

  const handleDeletePlan = (id: number) => {
    const updatedPlans = plans.filter(plan => plan.id !== id);
    setPlans(updatedPlans);
    localStorage.setItem("plans", JSON.stringify(updatedPlans));
    toast({
      title: "Plano removido",
      description: "O plano foi removido com sucesso",
    });
  };

  const handleSaveClient = (updatedClient: Client) => {
    const updatedClients = clients.map((c) =>
      c.id === updatedClient.id ? updatedClient : c
    );
    setClients(updatedClients);
    localStorage.setItem("clients", JSON.stringify(updatedClients));
    setSelectedClient(null);
    toast({
      title: "Cliente atualizado",
      description: "Os dados do cliente foram atualizados com sucesso",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 p-6"
    >
      <div className="max-w-[95%] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Painel Administrativo
          </h1>
          <Button onClick={logout} variant="outline">
            Sair
          </Button>
        </div>

        <Tabs defaultValue="clients" className="space-y-4">
          <TabsList>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="plans">Planos</TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <ClientsTable
              clients={clients}
              onEdit={setSelectedClient}
              onPrint={printClient}
            />
          </TabsContent>

          <TabsContent value="plans">
            <PlansManager
              plans={plans}
              onAddPlan={handleAddPlan}
              onDeletePlan={handleDeletePlan}
            />
          </TabsContent>
        </Tabs>

        {selectedClient && (
          <EditClientModal
            client={selectedClient}
            onSave={handleSaveClient}
            onCancel={() => setSelectedClient(null)}
            onChange={setSelectedClient}
          />
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
