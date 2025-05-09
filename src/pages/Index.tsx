
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useClientRegistration } from "@/hooks/useClientRegistration";
import LoadingState from "@/components/client/LoadingState";
import ErrorState from "@/components/client/ErrorState";
import EmptyPlansState from "@/components/client/EmptyPlansState";
import ClientRegistrationForm from "@/components/client/ClientRegistrationForm";

const Index = () => {
  const { plans, isLoading, isError, reloadPlans } = useClientRegistration();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white relative overflow-hidden"
    >
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
      
      <div className="max-w-2xl mx-auto pt-8">
        <div className="flex justify-center mb-6">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src="/lovable-uploads/d03abdb3-b61b-43e7-b5d4-4983ff5fcf27.png"
            alt="Linknet Vale Logo"
            className="w-48 md:w-64"
          />
        </div>
        
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 mb-8"
        >
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Cadastro de Cliente
          </h1>
          
          {isLoading ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState onRetry={reloadPlans} />
          ) : plans.length === 0 ? (
            <EmptyPlansState />
          ) : (
            <ClientRegistrationForm plans={plans} />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Index;
