
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onLogout: () => void;
}

export const DashboardHeader = ({ onLogout }: DashboardHeaderProps) => {
  return (
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
        <h1 className="text-2xl font-semibold text-blue-900">
          Painel Administrativo
        </h1>
        <Button onClick={onLogout} variant="outline" className="border-blue-300 text-blue-900 hover:bg-blue-50">
          Sair
        </Button>
      </div>
    </div>
  );
};
