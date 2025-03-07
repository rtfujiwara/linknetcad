
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { EditClientModal } from "@/components/admin/EditClientModal.jsx";
import { printClient } from "@/utils/printClient";
import { FiberOpticBackground } from "@/components/admin/FiberOpticBackground";
import { DashboardHeader } from "@/components/admin/DashboardHeader.jsx";
import { DashboardTabs } from "@/components/admin/DashboardTabs.jsx";
import { DeleteClientDialog } from "@/components/admin/DeleteClientDialog.jsx";

const AdminDashboard = () => {
  const { isAuthenticated, logout, hasPermission, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [plans, setPlans] = useState([]);
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

  const handleAddPlan = (newPlan) => {
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

  const handleDeletePlan = (id) => {
    const updatedPlans = plans.filter(plan => plan.id !== id);
    setPlans(updatedPlans);
    localStorage.setItem("plans", JSON.stringify(updatedPlans));
    toast({
      title: "Plano removido",
      description: "O plano foi removido com sucesso",
    });
  };

  const handleSaveClient = (updatedClient) => {
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

  const handleDeleteClient = (client) => {
    setClientToDelete(client);
  };

  const confirmDeleteClient = () => {
    if (!clientToDelete) return;
    
    const updatedClients = clients.filter(c => c.id !== clientToDelete.id);
    setClients(updatedClients);
    localStorage.setItem("clients", JSON.stringify(updatedClients));
    setClientToDelete(null);
    
    toast({
      title: "Cliente excluído",
      description: "O cliente foi excluído com sucesso",
      variant: "destructive",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white relative overflow-hidden p-6"
    >
      <FiberOpticBackground />

      <div className="max-w-[95%] mx-auto relative">
        <DashboardHeader onLogout={logout} />

        <div className="bg-white/30 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <DashboardTabs 
            clients={clients}
            plans={plans}
            hasManagePlansPermission={hasPermission("manage_plans")}
            hasManageUsersPermission={hasPermission("manage_users")}
            hasEditClientsPermission={hasPermission("edit_clients")}
            hasPrintClientsPermission={hasPermission("print_clients")}
            hasDeletePermission={isAdmin || hasPermission("delete_data")}
            onEditClient={setSelectedClient}
            onPrintClient={printClient}
            onDeleteClient={handleDeleteClient}
            onAddPlan={handleAddPlan}
            onDeletePlan={handleDeletePlan}
          />
        </div>

        {selectedClient && (
          <EditClientModal
            client={selectedClient}
            onSave={handleSaveClient}
            onCancel={() => setSelectedClient(null)}
            onChange={setSelectedClient}
          />
        )}

        <DeleteClientDialog 
          clientToDelete={clientToDelete}
          onOpenChange={(open) => !open && setClientToDelete(null)}
          onConfirmDelete={confirmDeleteClient}
        />
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
