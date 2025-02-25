
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
import { UsersManager } from "@/components/admin/UsersManager";
import { EditClientModal } from "@/components/admin/EditClientModal";
import { printClient } from "@/utils/printClient";
import { Client } from "@/types/client";
import { Plan } from "@/types/plan";

const AdminDashboard = () => {
  const { isAuthenticated, logout, hasPermission } = useAuth();
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
      className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden p-6"
    >
      {/* Efeito de fibra óptica */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,190,255,0.3)_0%,rgba(0,50,150,0.6)_100%)]"></div>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-[2px] bg-blue-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 100}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: Math.random() * 0.5 + 0.2,
              boxShadow: '0 0 10px rgba(120,190,255,0.8)',
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-[95%] mx-auto relative">
        <div className="flex flex-col items-center mb-8">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src="/lovable-uploads/d03abdb3-b61b-43e7-b5d4-4983ff5fcf27.png"
            alt="Linknet Vale Logo"
            className="w-32 mb-6"
          />
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-semibold text-white">
              Painel Administrativo
            </h1>
            <Button onClick={logout} variant="outline" className="bg-white/10 text-white hover:bg-white/20">
              Sair
            </Button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <Tabs defaultValue="clients" className="space-y-4">
            <TabsList className="bg-white/20">
              <TabsTrigger value="clients" className="data-[state=active]:bg-blue-600 text-white">Clientes</TabsTrigger>
              {hasPermission("manage_plans") && (
                <TabsTrigger value="plans" className="data-[state=active]:bg-blue-600 text-white">Planos</TabsTrigger>
              )}
              {hasPermission("manage_users") && (
                <TabsTrigger value="users" className="data-[state=active]:bg-blue-600 text-white">Usuários</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="clients">
              <ClientsTable
                clients={clients}
                onEdit={client => hasPermission("edit_clients") && setSelectedClient(client)}
                onPrint={client => hasPermission("print_clients") && printClient(client)}
              />
            </TabsContent>

            <TabsContent value="plans">
              <PlansManager
                plans={plans}
                onAddPlan={handleAddPlan}
                onDeletePlan={handleDeletePlan}
              />
            </TabsContent>

            <TabsContent value="users">
              <UsersManager />
            </TabsContent>
          </Tabs>
        </div>

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
